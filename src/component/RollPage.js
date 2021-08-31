import React from 'react';
import Card from './Card';

export default class RollPage extends React.Component {
    // Given a character, return a card component with relevant buttons
    renderCard(character) {
        return <Card 
             name={character.name}
             value={character.value}
             image={character.image}
             key={character.name} />
    }

    render() {
        // Build card components based on props character data
        let cardsList = this.props.characters.map(this.renderCard);

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>
                {cardsList}
            </div>
        );
    }
}
