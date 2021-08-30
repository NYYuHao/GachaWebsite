import React from 'react';
import './Card.css';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            series: props.series,
            value: props.value,
            image: props.image
        };
    };

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
