import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import RollPage from './RollPage';
import CollectionPage from './CollectionPage';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="app">
                    <Link to="/">Roll</Link>
                    <Link to="/collection">Collection</Link>
                    <Switch>
                        <Route exact path='/'>
                            <RollPage />
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
