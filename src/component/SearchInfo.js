import React from 'react';
import './SearchInfo.css';

export default class SearchInfo extends React.Component {
    render() {
        if (this.props.searchMedia)
            // TODO: Render information, handle animations
            return (
                <div>
                    <div className="dim-overlay"
                        onClick={this.props.handleCloseSearch}/>
                    <div className="search-card">
                        <p>{this.props.searchMedia.title}</p>
                        <p>Start Date: {this.props.searchMedia.startDate}</p>
                        <p>End Date: {this.props.searchMedia.endDate}</p>
                    </div>
                </div>
            );
        else
            return null;
    }
}
