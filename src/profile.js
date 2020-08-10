import React from "react";
import Uploader from "./uploader";
import BioEditor from "./bioeditor";
import Wall from "./wall";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editbioIsVisible: false,
            uploaderIsVisible: false,
            posters: [],
            error: null,
            isLoaded: false,
        };
    }

    componentDidMount() {
        axios.get("/faveMovies/" + this.props.userId).then(({ data }) => {
            this.setState(data);
            for (var i = 0; i < this.state.faves.length; i++) {
                console.log("MOVIE LOOP", this.state.faves[i].movie_id);
                fetch(
                    `http://www.omdbapi.com/?i=${this.state.faves[i].movie_id}&apikey=27336ed8`
                )
                    .then((res) => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                isLoaded: true,

                                posters: [...this.state.posters, result],
                            });
                        },
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                error,
                            });
                        }
                    );
            }
        });
    }

    toggleEditbio() {
        this.setState({
            editbioIsVisible: !this.state.editbioIsVisible,
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    render() {
        return (
            <div id="profile">
                <div className="profile-element">
                    <div>
                        <img
                            className="big-profile"
                            src={this.props.imageUrl}
                            onError={(e) => (e.target.src = "/default.jpg")}
                        />
                    </div>

                    <div className="profile-element-2">
                        {this.props.bio != null && (
                            <div>
                                <h3>about me</h3>

                                <p>{this.props.bio}</p>
                                <button
                                    className="bio-btn"
                                    onClick={() => this.toggleEditbio()}
                                >
                                    edit bio
                                </button>
                            </div>
                        )}
                        {this.props.bio == null && (
                            <button
                                className="bio-btn"
                                onClick={() => this.toggleEditbio()}
                            >
                                Add a bio!
                            </button>
                        )}
                        <button
                            id="pic-upload-btn"
                            onClick={() => this.toggleModal()}
                        >
                            upload a new pic
                        </button>
                        {this.state.editbioIsVisible && (
                            <BioEditor
                                bio={this.props.bio}
                                toggleEditbio={() => this.toggleEditbio()}
                                applySubmittedBio={(arg) =>
                                    this.props.applySubmittedBio(arg)
                                }
                            />
                        )}
                    </div>
                </div>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={(arg) => this.props.methodInApp(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}

                {this.state.faves && this.state.faves.length > 0 && (
                    <div className="fave-container">
                        <h4>My favorite movies</h4>
                        <div className="populars">
                            {this.state.posters.map((poster) => (
                                <div key={poster.imdbID}>
                                    <Link to={"/movies/" + poster.imdbID}>
                                        <img
                                            className="pop-posters"
                                            src={poster.Poster}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {this.state.faves && this.state.faves.length == 0 && (
                    <div className="fave-container">
                        <p>
                            Looks like you haven't liked any movies yet! You can
                            do it
                            <Link to={"/movies"}> here!</Link>
                        </p>
                    </div>
                )}

                {<Wall userId={this.props.userId} />}
            </div>
        );
    }
}
