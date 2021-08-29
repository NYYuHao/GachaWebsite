import React from 'react';
import {getCharacterById} from '../logic/Anilist.js'
import './Card.css';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: null,
            series: null,
            value: null,
            image: null
        };
    };

    componentDidMount() {
        this.setCharacterState(this.state.id);
    }

    async setCharacterState(id) {
        let characterState = await getCharacterById(id);
        let character = characterState.data.Character;
        this.setState({
            name: character.name.full,
            value: character.favourites,
            image: character.image.large
        });
    }

    render() {
        return (
            <div className="card">
                <h2>{this.state.name}</h2>
                <p>{this.state.series}</p>
                <p>{this.state.value}</p>
                <img src={this.state.image} alt="Character"/>
            </div>
        );
    };
};
