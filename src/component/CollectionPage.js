import React from 'react';
import Card from './Card';

export default class CollectionPage extends React.Component {
    // Given a character, return a card component with relevant buttons
    renderCard(character) {
        return <Card 
            name={character.name}
            media={character.media}
            value={character.value}
            image={character.image}
            key={character.name} />
    }

    render() {
        // Build card components based on props character data
        let cardsList = Object.values(this.props.characters).map(this.renderCard);

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                {cardsList}
            </div>
        );
    }
}
