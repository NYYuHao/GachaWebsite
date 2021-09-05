import React from 'react';
import Card from './Card';

export default class CollectionPage extends React.Component {
    renderCard(character) {
        return <Card 
            name={character.name}
            value={character.value}
            image={character.image}
            key={character.name} />
    }

    render() {
        let cardsList = Object.values(this.props.characters).map(this.renderCard);

        return (
            <div className="collection-page">
                <h1>Collection</h1>
                {cardsList}
            </div>
        );
    }
}
