import React from 'react';
import './SearchInfo.css';

export default class SearchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTransitioning: false
        };
    }

    componentDidUpdate(prevProps) {
        
    }

    render() {
        if (this.props.media) {
            let genres = this.props.media.genres.join(", ");

            // TODO: Render information, handle animations
            return (
                <div>
                    <div className="dim-overlay"
                        onClick={this.props.handleCloseSearch}/>
                    <div className="search-card">
                        <img src={this.props.media.image} alt="Media"/>
                        <p>{this.props.media.title}</p>
                        <p>{this.props.media.type}</p>
                        <p>Genres: {genres}</p>
                        <p>Score: {this.props.media.averageScore}</p>
                        <p>Start Date: {this.props.media.startDate}</p>
                        <p>End Date: {this.props.media.endDate}</p>
                        <p>Source: {this.props.media.source}</p>
                    </div>
                </div>
            );
        }
        else
            return null;
    }
}
