import React from 'react';
import Card from './Card';
import './CollectionPage.css';

export default class CollectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortMethod: 'dateObtained'
        }
    }

    // Given a character, return a card component with relevant buttons
    renderCard = (character) => {
        return <div className="collected-card" key={character.id}>
                <Card 
                    character={character}
                    handleMediaSearch={this.props.handleMediaSearch}
                    key={character.id}/>
                <button onClick={() => this.props.handleRemove(character)}>
                    Remove
                </button>
            </div>
    }

    render() {
        // Build card components based on props character data
        // TODO: Define sort states
        // TODO: Create functions for setting sort state and sorting cards
        let cardsList;
        console.log(this.props.characters);
        switch (this.state.sortMethod) {
            case 'dateObtained':
                cardsList = Object.values(this.props.characters).sort((char1, char2) =>
                    Date.parse(char1.dateObtained) < Date.parse(char2.dateObtained)).map(this.renderCard);
                break;
            case 'name':
                cardsList = Object.values(this.props.characters).sort((char1, char2) =>
                    char1.name < char2.name).map(this.renderCard);
                break;
            default:
                cardsList = Object.values(this.props.characters).map(this.renderCard);
                break;
        }

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="sort-container">
                    <button className="sort-button">
                        <p>Sort</p>
                    </button>
                    <div className="sort-menu">
                        <button className="sort-button option"
                            onClick={() => this.setState({sortMethod: 'dateObtained'})}>
                            <p>Date</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.setState({sortMethod: 'name'})}>
                            <p>Name</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.setState({sortMethod: 'series'})}>
                            <p>Series</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.setState({sortMethod: 'value'})}>
                            <p>Value</p>
                        </button>
                    </div>
                </div>
                <div className="collection">
                    {cardsList}
                </div>
            </div>
        );
    }
}
