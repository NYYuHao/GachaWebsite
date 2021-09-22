import React from 'react';
import Card from './Card';
import './RollPage.css';

export default class RollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transitioning: false,
            currentCharacter: props.currentCharacter,
            nextCharacter: props.nextCharacter
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

    // When new props are given, change the state and handle animations
    componentDidUpdate(prevProps) {
        if (prevProps.currentCharacter !== this.props.currentCharacter) {
            // Avoid animation on first update with character info
            if (Object.keys(prevProps.currentCharacter).length === 0) {
                this.setState({
                    transitioning: false,
                    currentCharacter: this.props.currentCharacter,
                    nextCharacter: this.props.nextCharacter
                });
            }
            // Otherwise trigger transition
            else {
                this.setState({transitioning: true});
            }
        }
    }

    // When animations finish, change transition state and update characters
    onTransitionFinish() {
        this.setState({
            transitioning: false,
            currentCharacter: this.props.currentCharacter,
            nextCharacter: this.props.nextCharacter
        });
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.state.currentCharacter ? 
            this.renderCard(this.state.currentCharacter) : null;
        let nextCard = this.state.nextCharacter ?
            this.renderCard(this.state.nextCharacter) : null;

        // Define classNames based on whether the cards are in transition state
        let currentCardClasses = "current-card";
        currentCardClasses += this.state.transitioning ? " is-leaving" : "";
        let nextCardClasses = "next-card";
        nextCardClasses += this.state.transitioning ? " is-transitioning" : "";
        
        //TODO: If this.props.nextCharacter, render a background card while transitioning
        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>

                <div className="rolls">
                    <div onAnimationEnd={() => this.onTransitionFinish()}
                        className={currentCardClasses}>
                        {currentCard}
                    </div>

                    <div className={nextCardClasses}>
                        {nextCard}
                    </div>

                    {/* Buttons shouldn't function while animations are playing */}
                    <button onClick={!this.state.transitioning ?
                        this.props.handleClaim : null}>Claim</button>
                    <button onClick={!this.state.transitioning ?
                        this.props.handleSkip : null}>Skip</button>
                </div>
            </div>
        );
    }
}
