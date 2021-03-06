import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateObtained: this.props.dateObtained
        };
    }
    render() {
        return (
            <div className="card">
                <h2>{this.props.character.name}</h2>
                <h4>{this.props.character.media}</h4>
                <p>{this.props.character.value}</p>
                <img
                    onClick={() => this.props.handleMediaSearch(this.props.character.mediaId)}
                    src={this.props.character.image} alt="Character"/>
            </div>
        );
    };
};
