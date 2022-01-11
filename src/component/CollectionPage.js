import React from 'react';
import Card from './Card';
import './CollectionPage.css';

export default class CollectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortMethod: 'Date Obtained',
            sortAscending: true,
            searchResults: null,
            pageNum: 0
        }
    }

    // Given a character, return a card component with relevant buttons
    renderCard = (character) => {
        return <div className="card-container" key={character.id}>
                <Card 
                    character={character}
                    handleMediaSearch={this.props.handleMediaSearch}
                    key={character.id}/>
                <div className="card-buttons">
                    <button onClick={() => this.props.handleRemove(character)}>
                        Remove
                    </button>
                </div>
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
                {this.state.sortMethod === methodName ?
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

    // Update searchResults whenever something is typed in the search bar
    handleSearch = (event) => {
        if (event.target.value) {
            let charactersList = this.props.characters;
            let query = event.target.value.toLowerCase();
            let searchList = charactersList.filter((character) => {
                let name = character.name.toLowerCase();
                let media = character.media.toLowerCase();
                return name.includes(query) || media.includes(query)
            });
            this.setState({searchResults: searchList, pageNum: 0});
        }
        else {
            this.setState({searchResults: null, pageNum: 0});
        }
    }

    // Clear the current search query
    handleClearSearch = () => {
        let searchInput = document.getElementById('search-form');
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', {bubbles: true}));

    }

    // Handle remove all by passing only the characters that the user can
    // currently see
    handleRemoveAll = () => {
        if (window.confirm("Remove all characters shown from collection?")) {
            if (this.state.searchResults) {
                this.props.handleRemoveAllCollected(this.state.searchResults);

                // Clear the search prompt
                this.handleClearSearch();
            }
            else {
                this.props.handleRemoveAllCollected(this.props.characters);
            }
        }
    }

    // Change the page of cards that is currently being displayed
    // based on the button pressed
    changePage = (event) => {
        let oldPage = this.state.pageNum;
        let newPage;
        let numPages = this.state.searchResults ?
            Math.floor(this.state.searchResults.length / 20) + 1 :
            Math.floor(this.props.characters.length / 20) + 1;
        if (numPages === 0) return;

        // Going above or below page limit should circle around
        if (event.target.innerText === '<') {
            newPage = ((oldPage - 1) + numPages) % numPages;
        }
        else if (event.target.innerText === '>') {
            newPage = ((oldPage + 1) + numPages) % numPages;
        }

        this.setState({pageNum: newPage});
    }

    render() {
        // Build card components based on props character data
        // If a search was done, use those characters instead
        let charactersList = this.state.searchResults ?
            this.state.searchResults : this.props.characters;

        // Sort based on selection
        switch (this.state.sortMethod) {
            case 'Date Obtained':
                charactersList.sort((char1, char2) =>
                    this.compareFields(Date.parse(char1.dateObtained),
                        Date.parse(char2.dateObtained)));
                break;
            case 'Name':
                charactersList.sort((char1, char2) =>
                    this.compareFields(char1.name, char2.name));
                break;
            case 'Media':
                charactersList.sort((char1, char2) =>
                    this.compareFields(char1.media, char2.media));
                break;
            case 'Value':
                charactersList.sort((char1, char2) =>
                    this.compareFields(char1.value, char2.value));
                break;
            default:
                break;
        }
        // Only render enough cards to fit a page
        charactersList = charactersList.slice(this.state.pageNum*20, (this.state.pageNum+1)*20);

        // Change order if necessary
        if (!this.state.sortAscending) charactersList.reverse();
        let cardsList = charactersList.map(this.renderCard);

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <div className="info-bar option-bar">
                    <div className="sort-container">
                        <button className="sort-button">
                            Sort
                        </button>
                        <div className="sort-menu">
                            {this.renderSortButton('Date Obtained')}
                            {this.renderSortButton('Name')}
                            {this.renderSortButton('Media')}
                            {this.renderSortButton('Value')}
                        </div>
                    </div>
                    <div className="search-form">
                        <input type="text" id="search-form"
                            placeholder="Search" onInput={this.handleSearch}/>
                        <button onClick={this.handleClearSearch}>
                            Clear
                        </button>
                    </div>
                    <div className="remove-all-button">
                        <button className="sub-button" onClick={this.handleRemoveAll}>
                            Remove All
                        </button>
                    </div>
                    <div className="page-settings">
                        <button onClick={this.changePage}>&lt;</button>
                        <span>{this.state.pageNum + 1}</span>
                        <button onClick={this.changePage}>&gt;</button>
                    </div>
                </div>
                <div className="collection">
                    {cardsList}
                </div>
                <div className="info-bar option-bar">
                    <div className="page-settings">
                        <button onClick={this.changePage}>&lt;</button>
                        <span>{this.state.pageNum + 1}</span>
                        <button onClick={this.changePage}>&gt;</button>
                    </div>
                </div>
            </div>
        );
    }
}
