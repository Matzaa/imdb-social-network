import React from "react";
import Uploader from "./uploader";
import BioEditor from "./bioeditor";
import Wall from "./wall";
import axios from "./axios";

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
        // this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        console.log("profile compo loaded");
        console.log("this.props in Mount", this.props);
        axios.get("/faveMovies/" + this.props.userId).then(({ data }) => {
            console.log("data in faveMovies", data);
            this.setState(data);
            console.log("this.state after axios in OTHERPROFILE", this.state);
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
                            console.log("FETCH RESULT", result);
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
        console.log("this.state in profile.js", this.state);
        console.log("this.props in profile.js", this.props);
        console.log("toggling editbio");
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
                {this.props.userId && <div>{this.props.userId}!!!!!!!!!!</div>}

                {<Wall userId={this.props.userId} />}
            </div>
        );
    }
}
