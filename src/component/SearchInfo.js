import React from 'react';
import './SearchInfo.css';

export default class SearchInfo extends React.Component {
    render() {
        if (this.props.media)
            // TODO: Render information, handle animations
            return (
                <div>
                    <div className="dim-overlay"
                        onClick={this.props.handleCloseSearch}/>
                    <div className="search-card">
                        <img src={this.props.media.image} alt="Media"/>
                        <p>{this.props.media.title}</p>
                        <p>Start Date: {this.props.media.startDate}</p>
                        <p>End Date: {this.props.media.endDate}</p>
                    </div>
                </div>
            );
        else
            return null;
    }
}
