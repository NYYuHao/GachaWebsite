import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <h2>Character Name</h2>
                <p>Series Name</p>
                <p>Value</p>
                <p>Image</p>
            </div>
        );
    }
};
