import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import {getCharactersByIds} from '../logic/Anilist.js';
import {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, anilistToCharacter,
    saveDataToStorage} from '../logic/Data';

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCharacter: null,
            nextCharacter: null,
            rolledCharacterStack: [],
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

    // Handle claim when the claim button is clicked
    handleClaim() {
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

    // TODO: Fix this
    // Handle skip when the button is clicked on a card
    handleSkip(character) {
        console.log(`Skipped character: ${character.id}`);
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

    render() {
        return (
            <Router>
                <div className="app">
                    <Link to="/">Roll</Link>
                    <Link to="/collection">Collection</Link>
                    <Switch>
                        <Route exact path='/'>
                            <RollPage
                                currentCharacter={this.state.currentCharacter}
                                nextCharacter={this.state.nextCharacter}
                                handleClaim={() => this.handleClaim()}/>
                        </Route>
                        <Route path='/collection'>
                            <CollectionPage characters={this.state.collectedCharacters}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
