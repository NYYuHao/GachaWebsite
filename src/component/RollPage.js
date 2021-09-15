import React from 'react';
import {Spring, animated} from 'react-spring';
import Card from './Card';
import './RollPage.css';

export default class RollPage extends React.Component {
    // Given a character, return a card component
    renderCard(character) {
        return <Card 
            name={character.name}
            value={character.value}
            media={character.media}
            image={character.image}/>
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.renderCard(this.props.currentCharacter)
        let nextCard = this.renderCard(this.props.nextCharacter)

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>

                <Spring
                    from={{opacity: 0}}
                    to={{opacity: 1}}>
                    {styles => (
                        <animated.div style={styles} className="rolls">
                            {currentCard}
                            <button onClick={this.props.handleClaim}>Claim</button>
                            <button onClick={this.props.handleSkip}>Skip</button>
                            {nextCard}
                        </animated.div>
                    )}
                </Spring>
            </div>
        );
    }
}
