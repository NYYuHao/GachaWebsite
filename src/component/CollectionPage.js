import React from 'react';
import Card from './Card';

let cards = [100, 200, 300];
let cardsList = cards.map((card) => <Card key={card} id={card} />);

export default class CollectionPage extends React.Component {
    render() {
        return (
            <div className="collection-page">
                <h1>Collection</h1>
                {cardsList}
            </div>
        );
    }
}
