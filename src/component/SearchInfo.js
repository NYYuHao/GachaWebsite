import React from 'react';
import './SearchInfo.css';

export default class SearchInfo extends React.Component {
    render() {
        if (this.props.searchMedia)
            return (
                <div className="dim-overlay">
                    <div className="search-card">
                        Search Info
                    </div>
                </div>
            );
        else
            return null;
    }
}
