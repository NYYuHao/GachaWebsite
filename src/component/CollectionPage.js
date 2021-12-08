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
        let cardsList;
        switch (this.state.sortMethod) {
            case 'dateObtained':
                console.log('test');
                cardsList = Object.values(this.props.characters).sort((char1, char2) =>
                    char1.dateObtained < char2.dateObtained).map(this.renderCard);
                break;
            default:
                cardsList = Object.values(this.props.characters).map(this.renderCard);
                break;
        }

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="sort-button">
                    <span>Sort</span>
                    <div className="sort-options">
                        <p>Name</p>
                        <p>Series</p>
                        <p>Value</p>
                    </div>
                </div>
                <div className="collection">
                    {cardsList}
                </div>
            </div>
        );
    }
}
