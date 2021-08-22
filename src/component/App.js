import React from 'react';
import Card from './Card';

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>Gacha Website</h1>
                <Card />
            </div>
        );
    }
};
