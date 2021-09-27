import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import {getCharactersByIds} from '../logic/Anilist.js';
import {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, removeCharacterFromCollection,
    anilistToCharacter, saveDataToStorage} from '../logic/Data';
import './App.css'

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCharacter: {},
            nextCharacter: {},
            rolledCharacterStack: [],
            skippedCharacterStack: [],
            collectedCharacters: {}
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
                value: character.value,
                image: character.image
            };});
        this.setState({collectedCharacters: collectedState});
    }

    // Handle claim when the claim button is clicked on RollPage
    handleClaim = () => {
        // Update the state by shifting character data
        let claimedCharacter = this.state.currentCharacter;
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

    // Handle remove when the remove button is clicked on a card in
    // CollectionPage
    handleRemove = (character) => {
        removeCharacterFromCollection(character.id);

        let collectedState = Object.assign(this.state.collectedCharacters);
        delete collectedState[character.id];

        this.setState({collectedCharacters: collectedState});

        console.log(`Removed character: ${character.id}`);
    }

    render() {
        return (
            <Router>
                <div className="app">
                    <div className="navbar">
                        <Link to="/">Roll</Link>
                        <Link to="/collection">Collection</Link>
                    </div>
                    <Switch>
                        <Route exact path='/'>
                            <RollPage
                                currentCharacter={this.state.currentCharacter}
                                nextCharacter={this.state.nextCharacter}
                                handleClaim={this.handleClaim}
                                handleSkip={this.handleSkip}
                                skippedCharacters={this.state.skippedCharacterStack}/>
                        </Route>
                        <Route path='/collection'>
                            <CollectionPage
                                characters={this.state.collectedCharacters}
                                handleRemove={this.handleRemove}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
