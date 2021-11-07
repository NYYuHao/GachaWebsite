import React from 'react';
import Card from './Card';
import './CollectionPage.css';

export default class CollectionPage extends React.Component {
    // Given a character, return a card component with relevant buttons
    renderCard = (character) => {
        return <div key={character.id}>
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
        let cardsList = Object.values(this.props.characters).map(this.renderCard);

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="collection">
                    {cardsList}
                </div>
            </div>
        );
    }
}
