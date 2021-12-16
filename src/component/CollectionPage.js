import React from 'react';
import Card from './Card';
import './CollectionPage.css';

export default class CollectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortMethod: 'dateObtained',
            sortAscending: true
        }
    }

    // Given a character, return a card component with relevant buttons
    renderCard = (character) => {
        return <div className="collected-card" key={character.id}>
                <Card 
                    character={character}
                    handleMediaSearch={this.props.handleMediaSearch}
                    key={character.id}/>
                <button onClick={() => this.props.handleRemove(character)}>
                    Remove
                </button>
            </div>
    }

    // Compare function for sorting
    compareFields(arg1, arg2) {
        if (arg1 > arg2) return 1;
        if (arg1 == arg2) return 0;
        return -1;
    }

    // Change sort method depending on current state
    changeSortMethod(method) {
        // Change sort order if the same method was chosen
        // Otherwise change method and set order to ascending
        if (this.state.sortMethod === method) {
            this.setState({sortAscending: !this.state.sortAscending});
        }
        else {
            this.setState({sortMethod: method, sortAscending: true});
        }
    }

    render() {
        // Build card components based on props character data
        let cardsList;

        // Sort based on selection
        switch (this.state.sortMethod) {
            case 'dateObtained':
                cardsList = Object.values(this.props.characters).sort((char1, char2) =>
                    this.compareFields(Date.parse(char1.dateObtained), Date.parse(char2.dateObtained))).map(this.renderCard);
                break;
            case 'name':
                cardsList = Object.values(this.props.characters).sort((char1, char2) =>
                    this.compareFields(char1.name, char2.name)).map(this.renderCard);
                break;
            default:
                cardsList = Object.values(this.props.characters).map(this.renderCard);
                break;
        }
        // Change order if necessary
        if (!this.state.sortAscending) cardsList.reverse();

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="sort-container">
                    <button className="sort-button">
                        <p>Sort</p>
                    </button>
                    <div className="sort-menu">
                        <button className="sort-button option"
                            onClick={() => this.changeSortMethod('dateObtained')}>
                            <p>Date</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.changeSortMethod('name')}>
                            <p>Name</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.changeSortMethod('series')}>
                            <p>Series</p>
                        </button>
                        <button className="sort-button option"
                            onClick={() => this.changeSortMethod('value')}>
                            <p>Value</p>
                        </button>
                    </div>
                </div>
                <div className="collection">
                    {cardsList}
                </div>
            </div>
        );
    }
}
