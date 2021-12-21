import React from 'react';
import Card from './Card';
import './CollectionPage.css';

export default class CollectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortMethod: 'Date Obtained',
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

    // Returns a sort button based on the given sortMethod
    renderSortButton(methodName) {
        // Arrow components for sorting
        let arrowComponent = this.state.sortAscending ? 
            <p className="sort-button-arrow">↑</p> :
            <p className="sort-button-arrow">↓</p>;
        let emptyArrowComponent = <p className="sort-button-arrow"></p>;

        return <button className="sort-button option"
                onClick={() => this.changeSortMethod(methodName)}>
                <p className="sort-button-text">{methodName}</p>
                {this.state.sortMethod == methodName ?
                    arrowComponent : emptyArrowComponent}
            </button>
    }

    // Compare helper function for sorting
    compareFields(arg1, arg2) {
        if (arg1 > arg2) return 1;
        if (arg1 === arg2) return 0;
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
        let cardsList = Object.values(this.props.characters);

        // Sort based on selection
        switch (this.state.sortMethod) {
            case 'Date Obtained':
                cardsList.sort((char1, char2) =>
                    this.compareFields(Date.parse(char1.dateObtained),
                        Date.parse(char2.dateObtained)));
                break;
            case 'Name':
                cardsList.sort((char1, char2) =>
                    this.compareFields(char1.name, char2.name));
                break;
            case 'Media':
                cardsList.sort((char1, char2) =>
                    this.compareFields(char1.media, char2.media));
                break;
            case 'Value':
                cardsList.sort((char1, char2) =>
                    this.compareFields(char1.value, char2.value));
                break;
            default:
                break;
        }
        // Change order if necessary
        if (!this.state.sortAscending) cardsList.reverse();
        let cardComponentsList = cardsList.map(this.renderCard);

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="sort-container">
                    <button className="sort-button">
                        <p>Sort</p>
                    </button>
                    <div className="sort-menu">
                        {this.renderSortButton('Date Obtained')}
                        {this.renderSortButton('Name')}
                        {this.renderSortButton('Media')}
                        {this.renderSortButton('Value')}
                    </div>
                </div>
                <div className="collection">
                    {cardComponentsList}
                </div>
            </div>
        );
    }
}
