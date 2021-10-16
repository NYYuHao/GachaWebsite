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
            image={character.image}
            key={character.id}/>
    }

    // Given a skipped character, return a card component and an additional
    // button to claim it
    renderSkippedCard(character) {
        return <div key={character.id}>
                <Card
                    name={character.name}
                    value={character.value}
                    media={character.media}
                    image={character.image}/>
                <button onClick={this.props.handleClaimSkipped}>Claim</button>
            </div>
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
        // Prevent animations when an irrelevant animation finishes
        if (this.state.isCardTransitioning) {
            this.setState({
                isCardTransitioning: false,
                currentCharacter: this.props.currentCharacter,
                nextCharacter: this.props.nextCharacter
            });
        }
    }

    // When interface button is clicked, handle animation
    handleInterfaceClick() {
        this.setState({
            isInterfaceTransitioning: true
        });
    }

    // When interface transition animations finish, change transition and interface state
    onInterfaceTransitionFinish() {
        // Prevent animations when an irrelevant animation finishes
        if (this.state.isInterfaceTransitioning) {
            this.setState({
                isInterfaceTransitioning: false,
                onSkipPage: !this.state.onSkipPage
            });
        }
    }

    render() {
        // Build card components based on props character data
        let currentCard = this.state.currentCharacter ? 
            this.renderCard(this.state.currentCharacter) : null;
        let nextCard = this.state.nextCharacter ?
            this.renderCard(this.state.nextCharacter) : null;
        let skippedCards = this.props.skippedCharacters.map(
            (character) => this.renderSkippedCard(character));

        // Define classNames based on whether the cards are in transition state
        let cardTransitionClass = this.state.isCardTransitioning
            ? " is-transitioning" : "";
        // If there is still a card to load in, keep a card in the background
        // for transitions
        let backgroundCardClasses = this.props.nextCharacter
            ? "card next-card" : "";

        // Define classNames for whether the user is transitioning from rolls to skips
        // For the switch button, change its state for animations
        let rollsTransitionClass = "";
        let skipsTransitionClass = "";
        let switchButtonTransitionClass = "";
        if (this.state.isInterfaceTransitioning) {
            rollsTransitionClass = this.state.onSkipPage ? " is-entering" : " is-leaving";
            skipsTransitionClass = this.state.onSkipPage ? " is-leaving" : " is-entering";
            switchButtonTransitionClass = this.state.onSkipPage ? " to-rolls" : " to-skips";
        }

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

                        {nextCard &&
                            <div className={"next-card" + cardTransitionClass}>
                                <div className="card card-back">
                                </div>
                                <div className="card-front">
                                    {nextCard}
                                </div>
                            </div>
                        }
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
                    () => this.handleInterfaceClick() : null}
                    style = {this.state.onSkipPage ? 
                        {left: "10px", transform: "rotateZ(180deg)"} : 
                        {left: "calc(100% - 110px)"}}
                    className={"switch-button" + switchButtonTransitionClass}>
                    >
                </button>

                
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
