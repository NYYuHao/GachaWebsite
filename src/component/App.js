import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import {getCharactersByIds} from '../logic/Anilist.js';
import {generateCharacterIds, addCharacterToCollection} from '../logic/Data';

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rollCharacters: {}
        };
    }

    componentDidMount() {
        // Set the characters that appear on the roll page
        this.setRollCharacters(generateCharacterIds());

        // TODO: Set up event listener on page close to save data
    }

    async setRollCharacters(ids) {
        // Get the character data returned by Anilist
        let charactersData = await getCharactersByIds(ids);

        // Update the state by mapping all returned characters to expected
        // array format
        let rollState = {};
        charactersData.data.Page.characters.forEach((character) => {
            rollState[character.id] = {
                name: character.name.full,
                value: character.favourites,
                image: character.image.large,
                handleClaim: () => this.handleClaim(character.id),
                handleSkip: () => this.handleSkip(character.id)
            };});
        this.setState({rollCharacters: rollState});
    }

    // Handle claim when the button is clicked on a card
    handleClaim(id) {
        console.log(`Claimed character: ${id}`);

        // Delete the character from state
        delete this.state.rollCharacters[id];
        this.setState({rollCharacters: this.state.rollCharacters});

        // Add the character to collection
        addCharacterToCollection(id);
    }

    // Handle skip when the button is clicked on a card
    handleSkip(id) {
        console.log(`Skipped character: ${id}`);
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
                            <CollectionPage />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
