import React from 'react';
import Card from './Card';

export default class RollPage extends React.Component {
    // Given a character, return a card component with relevant buttons
    renderCard(character) {
        return <Card 
            name={character.name}
            value={character.value}
            media={character.media}
            image={character.image}/>
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.props.currentCharacter ?
            this.renderCard(this.props.currentCharacter) : null;
        let nextCard = this.props.nextCharacter ?
            this.renderCard(this.props.nextCharacter) : null;

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>
                {currentCard}
                <button onClick={this.props.handleClaim}>Claim</button>
                <button onClick={this.props.handleSkip}>Skip</button>
                {nextCard}
            </div>
        );
    }
}
