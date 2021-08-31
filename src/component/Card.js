import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <h2>{this.props.name}</h2>
                <p>{this.props.series}</p>
                <p>{this.props.value}</p>
                <img src={this.props.image} alt="Character"/>
                <button onClick={this.props.handleClaim}>Claim</button>
                <button onClick={this.props.handleSkip}>Skip</button>
            </div>
        );
    };
};
