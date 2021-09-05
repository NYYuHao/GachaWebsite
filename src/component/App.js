import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import {getCharactersByIds} from '../logic/Anilist.js';
import {generateCharacterIds, getCollectedCharacterIds,
    addCharacterToCollection, anilistToCharacter} from '../logic/Data';

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rollCharacters: {},
            collectedCharacters: {}
        };
    }

    componentDidMount() {
        // Set the characters that appear on the roll page
        this.setRollCharacters(generateCharacterIds());
        this.setCollectedCharacters(getCollectedCharacterIds());

        // TODO: Set up event listener on page close to save data
    }

    // Set the state to contain the randomly generated characters for rolling
    async setRollCharacters(ids) {
        // Get the character data returned by Anilist
        let charactersData = await getCharactersByIds(ids);

        // Update the state by mapping all returned characters to expected
        // array format
        let rollState = {};
        charactersData.data.Page.characters.forEach((anilistChar) => {
            let character = anilistToCharacter(anilistChar);
            rollState[character.id] = {
                id: character.id,
                name: character.name,
                value: character.value,
                image: character.image,
                handleClaim: () => this.handleClaim(character),
                handleSkip: () => this.handleSkip(character)
            };});
        this.setState({rollCharacters: rollState});
    }

    // Handle claim when the button is clicked on a card
    handleClaim(character) {
        console.log(`Claimed character: ${character.id}`);

        // Delete the character from state
        // TODO: Probably shouldn't mutate rollCharacters
        delete this.state.rollCharacters[character.id];

        // Add the character to collection
        let collectedCharacters =
            Object.assign(this.state.collectedCharacters);
        collectedCharacters[character.id] = character;
        addCharacterToCollection(character.id);

        this.setState({
            rollCharacters: this.state.rollCharacters,
            collectedCharacters: this.state.collectedCharacters
        });
    }

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
                            <RollPage characters={this.state.rollCharacters}/>
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
