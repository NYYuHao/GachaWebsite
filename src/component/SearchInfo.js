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
        if (prevProps.media !== this.props.media) {
            this.setState({isTransitioning: true});
        }
    }

    onTransitionFinish() {
        this.setState({isTransitioning: false});
    }

    render() {
        // Define animation class names for the overlay
        let searchOverlayTransitionClass = "";
        if (this.state.isTransitioning) {
            searchOverlayTransitionClass = this.props.media ? " is-entering" : " is-leaving"
        }

        if (this.props.media) {
            let genres = this.props.media.genres.join(", ");

            // TODO: Render information, handle animations
            // TODO: Fix animation end
            return (
                <div onAnimationEnd={() => this.onTransitionFinish()}>
                    <div className={"dim-overlay" + searchOverlayTransitionClass}
                        onClick={!this.state.isTransitioning ? this.props.handleCloseSearch : null}/>
                    <div className={"search-card" + searchOverlayTransitionClass}>
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
