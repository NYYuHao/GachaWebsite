import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import SearchInfo from './SearchInfo';
import {getCharactersByIds, getMediaById} from '../logic/Anilist.js';
import {generateCharacterIds, getCollectedCharacterIds, getTotalMoney,
    addCharacterToCollection, removeCharacterFromCollection,
    anilistToCharacter, anilistToMedia, saveDataToStorage}
    from '../logic/Data';
import './App.css'

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCharacter: null,         // RollPage: Current character
            nextCharacter: null,            // RollPage: Next character
            rolledCharacterStack: [],       // RollPage: Stack of remaining characters
            rolledCharacterBuffer: [],      // RollPage: Buffer characters to reduce API calls, invisible to user
            skippedCharacterStack: [],      // RollPage: Array of skipped characters
            collectedCharacters: {},        // CollectionPage: {id: character} pairs for all collected characters
            searchMedia: null,              // Object representing media for searching, null if no search active
            totalMoney: 0
        };
    }

    componentDidMount() {
        // Set the characters that appear on the roll page
        this.setRollCharacters();
        this.setCollectedCharacters(getCollectedCharacterIds());
        this.setTotalMoney(getTotalMoney());

        // Set up event listener on page close to save data
        window.addEventListener("beforeunload", (ev) => {
            saveDataToStorage({
                totalMoney: this.state.totalMoney
            });
        });
    }

    // Asynchronously update the old roll buffer
    updateRollBuffer = async (oldBuffer) => {
        // TODO: Consider mutex or similar to prevent this function from
        // running multiple times
        let newCharacters = await getCharactersByIds(generateCharacterIds());
        let characterBuffer = oldBuffer.concat(newCharacters.data.Page.characters);
        this.setState({rolledCharacterBuffer: characterBuffer});
    }

    // Set the state to contain randomly generated characters for rolling
    async setRollCharacters() {
        // Get the character data returned by Anilist
        // Update the roll buffer if no characters are available
        // (This should hopefully only occur on page load)
        if (this.state.rolledCharacterBuffer.length === 0) {
            await this.updateRollBuffer([]);
        }
        let characterBuffer = [...this.state.rolledCharacterBuffer];
        let characters = characterBuffer.slice(0, 10);
        characterBuffer = characterBuffer.slice(10);

        // Update the state by mapping all returned characters to expected
        // array format
        let rollStack = [];
        characters.forEach((anilistChar) => {
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
            rolledCharacterStack: rollStack,
            rolledCharacterBuffer: characterBuffer
        }, () => {
            // TODO: Carefully inspect this logic to avoid race conditions
            // After updating state, add characters to roll buffer if running low
            if (characterBuffer.length < 20) {
                this.updateRollBuffer(characterBuffer);
            }
        });

    }

    // Set the state to contain characters already in the collection
    async setCollectedCharacters(ids) {
        let collectedState = {};
        let hasNextPage = true;
        let pageNum = 1;

        // Loop in order to get all the pages
        while (hasNextPage) {
            // Get the character data returned by Anilist
            let charactersData = await getCharactersByIds(ids, pageNum);

            // Update the state by mapping all returned characters to expected
            // array format
            charactersData.data.Page.characters.forEach((anilistChar) => {
                let character = anilistToCharacter(anilistChar);
                collectedState[character.id] = {
                    id: character.id,
                    name: character.name,
                    media: character.media,
                    mediaId: character.mediaId,
                    value: character.value,
                    image: character.image,
                    dateObtained: character.dateObtained
                };});

            hasNextPage = charactersData.data.Page.pageInfo.hasNextPage;
            pageNum += 1;
        }

        this.setState({collectedCharacters: collectedState});
    }

    // Set the state with the total money the user already had
    async setTotalMoney(money) {
        this.setState({totalMoney: money});
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
        let collectedCharacters = {...this.state.collectedCharacters};
        collectedCharacters[claimedCharacter.id] = {
            ...claimedCharacter, dateObtained: new Date()
        };
        addCharacterToCollection(claimedCharacter.id);

        this.setState({
            rolledCharacterStack: rolledCharacterStack,
            currentCharacter: currentCharacter,
            nextCharacter: nextCharacter,
            collectedCharacters: collectedCharacters
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
            (skippedCharacter) => skippedCharacter !== character);

        // Add the character to collection
        let collectedCharacters = {...this.state.collectedCharacters};
        collectedCharacters[character.id] = {
            ...character, dateObtained: new Date()
        };
        addCharacterToCollection(character.id);

        // Update state to change skipped characters
        this.setState({
            skippedCharacterStack: skippedCharacters,
            collectedCharacters: collectedCharacters
        });
        
        console.log(`Claimed character: ${character.id}`);
    }

    // Handle remove for skipped characters in RollPage
    handleRemoveSkipped = (character) => {
        // Add the value of the removed character to total money
        let totalMoney = this.state.totalMoney + character.value;

        // Remove the skipped character from the list of skips
        let skippedCharacters = this.state.skippedCharacterStack.filter(
            (skippedCharacter) => skippedCharacter !== character);
        
        // Update state to change skipped characters
        this.setState({
            skippedCharacterStack: skippedCharacters,
            totalMoney: totalMoney
        });
        console.log(`Removed character: ${character.id}`);
    }

    // Handle remove all when the remove all button is clicked in
    // RollPage
    handleRemoveAllSkipped = () => {
        // Add the value of the removed characters to total money
        let totalMoney = this.state.totalMoney;
        this.state.skippedCharacterStack.forEach((character) =>
            {totalMoney += character.value});

        // Update state to change skipped characters
        this.setState({
            skippedCharacterStack: [],
            totalMoney: totalMoney
        });
        console.log(`Removed all skipped characters`);
    }

    // Handle reroll when characters run out in RollPage
    handleReroll = () => {
        this.setRollCharacters();
        console.log("Rerolling");
    }

    // Handle remove when the remove button is clicked on a card in
    // CollectionPage
    handleRemoveCollected = (character) => {
        removeCharacterFromCollection(character.id);

        let collectedState = Object.assign(this.state.collectedCharacters);
        delete collectedState[character.id];

        this.setState({collectedCharacters: collectedState});

        console.log(`Removed character: ${character.id}`);
    }

    // Handle remove all when the remove all button is clicked in
    // CollectionPage
    handleRemoveAllCollected = (characters) => {
        let collectedState = Object.assign(this.state.collectedCharacters);

        characters.forEach((character) => {
            removeCharacterFromCollection(character.id);
            delete collectedState[character.id];
            console.log(`Removed character: ${character.id}`);
        });

        this.setState({collectedCharacters: collectedState});
    }

    // Handle media search when the search button is clicked on a card
    handleMediaSearch = async (mediaId) => {
        let anilistMedia = await getMediaById(mediaId);
        let mediaInfo = anilistToMedia(anilistMedia.data.Media);

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
                        <Link to="/GachaWebsite">Roll</Link>
                        <Link to="/GachaWebsite/collection">Collection</Link>
                        <Link to="/GachaWebsite" onClick={saveDataToStorage}>Save</Link>
                    </div>
                    <SearchInfo
                        media={this.state.searchMedia}
                        handleCloseSearch={this.handleCloseSearch}/>
                    <Switch>
                        <Route exact path='/GachaWebsite'>
                            <RollPage
                                currentCharacter={this.state.currentCharacter}
                                nextCharacter={this.state.nextCharacter}
                                numberRemainingCharacters={this.state.rolledCharacterStack.length
                                    + (this.state.currentCharacter ?
                                    this.state.nextCharacter ? 2 : 1 : 0)}
                                skippedCharacters={this.state.skippedCharacterStack}
                                totalMoney={this.state.totalMoney}
                                handleClaim={this.handleClaim}
                                handleSkip={this.handleSkip}
                                handleClaimSkipped={this.handleClaimSkipped}
                                handleRemoveSkipped={this.handleRemoveSkipped}
                                handleRemoveAllSkipped={this.handleRemoveAllSkipped}
                                handleReroll={this.handleReroll}
                                handleMediaSearch={this.handleMediaSearch}/>
                        </Route>
                        <Route path='/GachaWebsite/collection'>
                            <CollectionPage
                                characters={Object.values(this.state.collectedCharacters)}
                                totalMoney={this.state.totalMoney}
                                handleRemoveCollected={this.handleRemoveCollected}
                                handleRemoveAllCollected={this.handleRemoveAllCollected}
                                handleMediaSearch={this.handleMediaSearch}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
