import React from 'react';
import Card from './Card';
import './RollPage.css';

export default class RollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCharacter: {},
            nextCharacter: {}
        }
    }

    // Given a character, return a card component
    renderCard(character) {
        return <Card 
            name={character.name}
            value={character.value}
            media={character.media}
            image={character.image}/>
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentCharacter !== this.props.currentCharacter) {
            // TODO: Handle animation
            console.log('Switching characters');
            this.setState({
                currentCharacter: this.props.currentCharacter,
                nextCharacter: this.props.nextCharacter
            });
        }
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.renderCard(this.state.currentCharacter);
        let nextCard = this.renderCard(this.state.nextCharacter);

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>

                <div className="rolls">
                    {currentCard}
                    <button onClick={this.props.handleClaim}>Claim</button>
                    <button onClick={this.props.handleSkip}>Skip</button>
                    {nextCard}
                </div>
            </div>
        );
    }
}
