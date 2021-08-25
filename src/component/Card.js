import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {character: this.getCharacter(props.id)};
    };

    getCharacter(id) {
        return {
            name: "Test Name",
            series: "Test Series",
            value: id,
            image: "Test Link"
        };
    };

    render() {
        return (
            <div className="card">
                <h2>{this.state.character.name}</h2>
                <p>{this.state.character.series}</p>
                <p>{this.state.character.value}</p>
                <p>{this.state.character.image}</p>
            </div>
        );
    };
};
