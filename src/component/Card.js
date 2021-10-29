import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <h2>{this.props.name}</h2>
                <h4>{this.props.media}</h4>
                <p>{this.props.value}</p>
                <img src={this.props.image} alt="Character"/>
            </div>
        );
    };
};
