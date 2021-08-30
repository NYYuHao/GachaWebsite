import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import RollPage from './RollPage';
import CollectionPage from './CollectionPage';
import {getCharactersByIds} from '../logic/Anilist.js';
import {generateCharacters} from '../logic/Data';

// App with router for switching between pages
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rollCharacters: []
        };
    }

    componentDidMount() {
        this.setRollCharacters(generateCharacters());
    }

    async setRollCharacters(ids) {
        // Get the character data returned by Anilist
        let charactersData = await getCharactersByIds(ids);

        // Update the state by mapping all returned characters to expected
        // array format
        this.setState({rollCharacters:
            charactersData.data.Page.characters.map((character) => {
                return {
                    name: character.name.full,
                    value: character.favourites,
                    image: character.image.large
                };}
        )});
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
