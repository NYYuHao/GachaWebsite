import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import SearchInfo from './SearchInfo';
import {getCharactersByIds, getMediaById} from '../logic/Anilist.js';
import {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, removeCharacterFromCollection,
    anilistToCharacter, saveDataToStorage} from '../logic/Data';
import './App.css'

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCharacter: null,         // RollPage: Current character
            nextCharacter: null,            // RollPage: Next character
            rolledCharacterStack: [],       // RollPage: Stack of remaining characters
            skippedCharacterStack: [],      // RollPage: Array of skipped characters
            collectedCharacters: {},        // CollectionPage: {id: character} pairs for all characters
            searchMedia: null               // Object representing media for searching, null if no search active
        };
    }

    componentDidMount() {
        // Set the characters that appear on the roll page
        this.setRollCharacters(generateCharacterIds());
        this.setCollectedCharacters(getCollectedCharacterIds());

        // Set up event listener on page close to save data
        window.addEventListener("beforeunload", (ev) => {
            saveDataToStorage();
        });
    }

    // Set the state to contain the randomly generated characters for rolling
    async setRollCharacters(ids) {
        // Get the character data returned by Anilist
        let charactersData = await getCharactersByIds(ids);

        // Update the state by mapping all returned characters to expected
        // array format
        let rollStack = [];
        charactersData.data.Page.characters.forEach((anilistChar) => {
            let character = anilistToCharacter(anilistChar);
            rollStack.push({
                id: character.id,
                name: character.name,
                media: character.media,
                mediaId: character.mediaId,
                value: character.value,
                image: character.image,
            });});
        this.setState({
            currentCharacter: rollStack.pop(),
            nextCharacter: rollStack.pop(),
            rolledCharacterStack: rollStack
        });
    }

    // Set the state to contain characters already in the collection
    async setCollectedCharacters(ids) {
        // Get the character data returned by Anilist
        let charactersData = await getCharactersByIds(ids);

        // Update the state by mapping all returned characters to expected
        // array format
        let collectedState = {};
        charactersData.data.Page.characters.forEach((anilistChar) => {
            let character = anilistToCharacter(anilistChar);
            collectedState[character.id] = {
                id: character.id,
                name: character.name,
                media: character.media,
                mediaId: character.mediaId,
                value: character.value,
                image: character.image
            };});
        this.setState({collectedCharacters: collectedState});
    }

    // Handle claim when the claim button is clicked on RollPage
    handleClaim = () => {
        // Update the state by shifting character data
        let claimedCharacter = this.state.currentCharacter;
        if (!claimedCharacter || Object.keys(claimedCharacter).length === 0) return;
        let rolledCharacterStack = this.state.rolledCharacterStack.slice();
        let currentCharacter = this.state.nextCharacter;
        let nextCharacter = rolledCharacterStack.pop();

        // Add the character to collection
        let collectedCharacters =
            Object.assign(this.state.collectedCharacters);
        collectedCharacters[claimedCharacter.id] = claimedCharacter;
        addCharacterToCollection(claimedCharacter.id);

        this.setState({
            rolledCharacterStack: rolledCharacterStack,
            currentCharacter: currentCharacter,
            nextCharacter: nextCharacter
        });

        console.log(`Claimed character: ${claimedCharacter.id}`);
    }

    // Handle skip when the skip button is clicked on RollPage
    handleSkip = () => {
        // Update the state by shifting character data
        let skippedCharacter = this.state.currentCharacter;
        if (!skippedCharacter || Object.keys(skippedCharacter).length === 0) return;
        let rolledCharacterStack = this.state.rolledCharacterStack.slice();
        let skippedCharacterStack = this.state.skippedCharacterStack.slice();
        let currentCharacter = this.state.nextCharacter;
        let nextCharacter = rolledCharacterStack.pop();

        // Add skipped character to stack for ability to claim in the future
        skippedCharacterStack.push(skippedCharacter);

        this.setState({
            rolledCharacterStack: rolledCharacterStack,
            skippedCharacterStack: skippedCharacterStack,
            currentCharacter: currentCharacter,
            nextCharacter: nextCharacter
        });

        console.log(`Skipped character: ${skippedCharacter.id}`);
    }

    // Handle claim for skipped characters in RollPage
    handleClaimSkipped = (character) => {
        // Remove the skipped character from the list of skips
        let skippedCharacters = this.state.skippedCharacterStack.filter(
            (skippedcharacter) => skippedcharacter !== character);

        // Add the character to collection
        let collectedCharacters =
            Object.assign(this.state.collectedCharacters);
        collectedCharacters[character.id] = character;
        addCharacterToCollection(character.id);

        // Update state to change skipped character
        this.setState({skippedCharacterStack: skippedCharacters});
        
        console.log(`Claimed character: ${character.id}`);
    }

    // Handle reroll when characters run out in RollPage
    handleReroll = () => {
        this.setRollCharacters(generateCharacterIds());
        console.log("Rerolling");
    }

    // Handle remove when the remove button is clicked on a card in
    // CollectionPage
    handleRemove = (character) => {
        removeCharacterFromCollection(character.id);

        let collectedState = Object.assign(this.state.collectedCharacters);
        delete collectedState[character.id];

        this.setState({collectedCharacters: collectedState});

        console.log(`Removed character: ${character.id}`);
    }

    // Handle media search when the search button is clicked on a card
    handleMediaSearch = async (mediaId) => {
        let mediaInfo = await getMediaById(mediaId);
        console.log(mediaInfo);

        this.setState({searchMedia: mediaInfo});
    }

    // Handle closing the search overlay when necessary
    handleCloseSearch = () => {
        this.setState({searchMedia: null});
    }

    render() {
        return (
            <Router>
                <div className="app">
                    <div className="navbar">
                        <Link to="/">Roll</Link>
                        <Link to="/collection">Collection</Link>
                    </div>
                    <SearchInfo searchMedia={this.state.searchMedia}/>
                    <Switch>
                        <Route exact path='/'>
                            <RollPage
                                currentCharacter={this.state.currentCharacter}
                                nextCharacter={this.state.nextCharacter}
                                numberRemainingCharacters={this.state.rolledCharacterStack.length}
                                skippedCharacters={this.state.skippedCharacterStack}
                                handleClaim={this.handleClaim}
                                handleSkip={this.handleSkip}
                                handleClaimSkipped={this.handleClaimSkipped}
                                handleReroll={this.handleReroll}
                                handleMediaSearch={this.handleMediaSearch}/>
                        </Route>
                        <Route path='/collection'>
                            <CollectionPage
                                characters={this.state.collectedCharacters}
                                handleRemove={this.handleRemove}
                                handleMediaSearch={this.handleMediaSearch}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
