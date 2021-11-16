import React from 'react';
import './SearchInfo.css';

export default class SearchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTransitioning: false,
            media: null
        };
    }

    // When new props are given, update media info if necessary and start
    // animations
    componentDidUpdate(prevProps) {
        if (prevProps.media !== this.props.media) {
            // Keep the state if transitioning out, update if transitioning in
            this.setState({
                isTransitioning: true,
                media: this.props.media ? this.props.media : this.state.media
            });
        }
    }

    // When search card animations finish, change transition state and update
    // media if necessary
    onTransitionFinish() {
        if (!this.props.media) {
            this.setState({isTransitioning: false, media: null});
        }
        else {
            this.setState({isTransitioning: false});
        }
    }

    render() {
        // Define animation class names for the overlay
        let searchOverlayTransitionClass = "";
        if (this.state.isTransitioning) {
            searchOverlayTransitionClass = this.props.media ? " is-entering" : " is-leaving"
        }

        if (this.state.media) {
            let genres = this.state.media.genres.join(", ");

            // TODO: Render information, handle animations
            // TODO: Fix animation end
            return (
                <div onAnimationEnd={() => this.onTransitionFinish()}>
                    <div className={"dim-overlay" + searchOverlayTransitionClass}
                        onClick={!this.state.isTransitioning ? this.props.handleCloseSearch : null}/>
                    <div className={"search-card" + searchOverlayTransitionClass}>
                        <div className="left-bar">
                            <img src={this.state.media.image} alt="Media"/>
                            <p>{this.state.media.title}</p>
                        </div>
                        <div className="main-info">
                            <p>{this.state.media.description}</p>
                            <p>{this.state.media.type}</p>
                            <p>Genres: {genres}</p>
                            <p>Score: {this.state.media.averageScore}</p>
                            <p>Start Date: {this.state.media.startDate}</p>
                            <p>End Date: {this.state.media.endDate}</p>
                            <p>Source: {this.state.media.source}</p>
                        </div>
                    </div>
                </div>
            );
        }
        else
            return null;
    }
}
