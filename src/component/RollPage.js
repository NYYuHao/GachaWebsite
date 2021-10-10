import React from 'react';
import Card from './Card';
import './RollPage.css';

export default class RollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCardTransitioning: false,
            isInterfaceTransitioning: false,
            onSkipPage: false,
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

    // When new props are given, change the state to update cards and handle
    // animations
    componentDidUpdate(prevProps) {
        if (prevProps.currentCharacter !== this.props.currentCharacter) {
            // Avoid animation on first update with character info
            if (Object.keys(prevProps.currentCharacter).length === 0) {
                this.setState({
                    isCardTransitioning: false,
                    currentCharacter: this.props.currentCharacter,
                    nextCharacter: this.props.nextCharacter
                });
            }
            // Otherwise trigger transition
            else {
                this.setState({isCardTransitioning: true});
            }
        }
    }

    // When card animations finish, change transition state and update characters
    onCardTransitionFinish() {
        this.setState({
            isCardTransitioning: false,
            currentCharacter: this.props.currentCharacter,
            nextCharacter: this.props.nextCharacter
        });
    }

    // When interface button is clicked, handle animation
    handleInterfaceClick() {
        this.setState({
            isInterfaceTransitioning: true
        });
    }

    // When interface transition animations finish, change transition and interface state
    onInterfaceTransitionFinish() {
        this.setState({
            isInterfaceTransitioning: false,
            onSkipPage: !this.state.onSkipPage
        });
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.state.currentCharacter ? 
            this.renderCard(this.state.currentCharacter) : null;
        let nextCard = this.state.nextCharacter ?
            this.renderCard(this.state.nextCharacter) : null;
        let skippedCards = this.props.skippedCharacters.map(this.renderCard);

        // Define classNames based on whether the cards are in transition state
        let cardTransitionClass = this.state.isCardTransitioning
            ? " is-transitioning" : "";
        // If there is still a card to load in, keep a card in the background
        // for transitions
        let backgroundCardClasses = this.props.nextCharacter
            ? "card next-card" : "";

        // Define classNames for whether the user is transitioning from rolls to skips
        let rollsTransitionClass = "";
        let skipsTransitionClass = "";
        if (this.state.isInterfaceTransitioning) {
            rollsTransitionClass = this.state.onSkipPage ? " is-entering" : " is-leaving";
            skipsTransitionClass = this.state.onSkipPage ? " is-leaving" : " is-entering";
        }

        // TODO: Add "Cards Remaining" maybe


        // While transitioning, disallow overflow to prevent scrollbars
        return (
            <div style={
                    this.state.isInterfaceTransitioning ? {overflow: 'hidden'} : {}}
                className="roll-page">

                <h1>Gacha Website</h1>

                <div style={
                        this.state.onSkipPage &&
                        !this.state.isInterfaceTransitioning ? {display: 'none'} : {}}
                    onAnimationEnd={() => this.onInterfaceTransitionFinish()}
                    className={"rolls" + rollsTransitionClass}>

                    <div className="card-grid">
                        <div onAnimationEnd={() => this.onCardTransitionFinish()}
                            className={"current-card" + cardTransitionClass}>
                            {currentCard}
                        </div>

                        <div className={backgroundCardClasses} />

                        <div className={"next-card" + cardTransitionClass}>
                            {nextCard}
                        </div>
                    </div>
                    <p>Cards remaining: {this.props.numberRemainingCharacters +
                            (this.state.currentCharacter ?
                            this.state.nextCharacter ? 2 : 1 : 0)}</p>

                    {/* Buttons shouldn't function while animations are playing */}
                    <button onClick={!this.state.isCardTransitioning ?
                        this.props.handleClaim : null}>Claim</button>
                    <button onClick={!this.state.isCardTransitioning ?
                        this.props.handleSkip : null}>Skip</button>
                </div>

                <button onClick={!this.state.isCardTransitioning ?
                    () => this.handleInterfaceClick() : null}>
                    Switch page</button>

                
                <div
                    style={!this.state.onSkipPage &&
                        !this.state.isInterfaceTransitioning ? {display: 'none'} : {}}
                    className={"skips" + skipsTransitionClass}>
                    {skippedCards}
                </div>
                

            </div>
        );
    }
}
