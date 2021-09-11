import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    render() {
        let removeButton = this.props.handleRemove ?
            <button onClick={this.props.handleRemove}>Remove</button> :
            null;

        return (
            <div className="card">
                <h2>{this.props.name}</h2>
                <h4>{this.props.media}</h4>
                <p>{this.props.value}</p>
                <img src={this.props.image} alt="Character"/>
                {removeButton}
            </div>
        );
    };
};
