import React from 'react';
import Card from './Card';
import './RollPage.css';

export default class RollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previousCharacter: {},
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
            console.log('Switching characters');
            this.setState({
                previousCharacter: prevProps.currentCharacter,
                currentCharacter: this.props.currentCharacter,
                nextCharacter: this.props.nextCharacter
            });
        }
    }

    render() {
        // Build card components based on props character data
        let previousCard = Object.keys(this.state.previousCharacter).length !== 0 ?
            this.renderCard(this.state.previousCharacter) : null;
        let currentCard = this.state.currentCharacter ? 
            this.renderCard(this.state.currentCharacter) : null;
        let nextCard = this.state.nextCharacter ?
            this.renderCard(this.state.nextCharacter) : null;

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>

                <div className="rolls">
                    <div key={this.state.previousCharacter.id} className="previous-card">
                        {previousCard}
                    </div>
                    <div key={currentCard} className="current-card">
                        {currentCard}
                    </div>
                    <button onClick={this.props.handleClaim}>Claim</button>
                    <button onClick={this.props.handleSkip}>Skip</button>
                    {nextCard}
                </div>
            </div>
        );
    }
}
