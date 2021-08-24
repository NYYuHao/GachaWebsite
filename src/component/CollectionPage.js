import React from 'react';
import Card from './Card';

export default class CollectionPage extends React.Component {
    render() {
        return (
            <div className="collection-page">
                <h1>Collection</h1>
                <Card />
            </div>
        );
    }
}
