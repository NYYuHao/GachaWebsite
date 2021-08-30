import React from 'react';
import Card from './Card';

export default class RollPage extends React.Component {
    render() {
        // Build card components based on props character data
        let cardsList = this.props.characters.map((character) => {
                return <Card 
                    name={character.name}
                    value={character.value}
                    image={character.image}
                    key={character.name} />
            }
        );

        return (
            <div className="roll-page">
                <h1>Gacha Website</h1>
                {cardsList}
            </div>
        );
    }
}
