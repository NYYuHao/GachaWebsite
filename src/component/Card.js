import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <h2>{this.props.character.name}</h2>
                <h4 onClick={() => this.props.handleMediaSearch(this.props.character.mediaId)}>
                    {this.props.character.media}
                </h4>
                <p>{this.props.character.value}</p>
                <img src={this.props.character.image} alt="Character"/>
            </div>
        );
    };
};
