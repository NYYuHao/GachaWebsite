import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import RollPage from './RollPage';
import Card from './Card';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="app">
                    <Link to="/">Roll</Link>
                    <Link to="/card">Card</Link>
                    <Switch>
                        <Route exact path='/'>
                            <RollPage />
                        </Route>
                        <Route path='/card'>
                            <Card />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
};
