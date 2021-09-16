import React from 'react';
import {Transition, config, animated} from 'react-spring';
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
        let currentCard = this.renderCard(this.props.currentCharacter);
        let nextCard = this.renderCard(this.props.nextCharacter);

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>

                <div className="rolls">
                    <Transition            
                        items={true}
                        from={{ opacity: 0 }}
                        enter={{ opacity: 1 }}
                        leave={{ opacity: 0 }}
                        delay={200}
                        config={config.molasses}>
                        {(styles, items) => (
                            <animated.div styles={styles}>
                                {currentCard}
                            </animated.div>
                        )}
                    </Transition>
                    <button onClick={this.props.handleClaim}>Claim</button>
                    <button onClick={this.props.handleSkip}>Skip</button>
                    {nextCard}
                </div>
            </div>
        );
    }
}
