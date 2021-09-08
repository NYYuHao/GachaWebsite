import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        let claimButton = this.props.handleClaim ? 
            <button onClick={this.props.handleClaim}>Claim</button> : null;
        let skipButton = this.props.handleSkip ? 
            <button onClick={this.props.handleSkip}>Skip</button> : null;

        return (
            <div className="card">
                <h2>{this.props.name}</h2>
                <p>{this.props.media}</p>
                <p>{this.props.value}</p>
                <img src={this.props.image} alt="Character"/>
                {claimButton}
                {skipButton}
            </div>
        );
    };
};
