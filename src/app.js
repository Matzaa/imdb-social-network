import React from "react";
import axios from "./axios";
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import Friends from "./friends";
import Navbar from "./navbar";
import Chat from "./chat";
import Movies from "./movies";
import Movie from "./movie-search";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("App mounted");
        console.log("this.state before get", this.state);
        axios.get("/user", this.state).then(({ data }) => {
            console.log("data in get user", data);
            this.setState(data);
            console.log("this.state after get", this.state);
        });
    }

    applySubmittedBio(arg) {
        this.setState({ bio: arg });
    }

    methodInApp(arg) {
        this.setState({ imageUrl: arg });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div id="app">
                        <div className="logo">
                            <div id="logologo">
                                <div id="logo-element"></div>
                                <div id="logo-element-2"></div>
                            </div>
                        </div>

                        <Profilepic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                        />
                        <Navbar />

                        <Route
                            exact
                            path="/"
                            sur
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                    imageUrl={this.state.imageUrl}
                                    userId={this.state.userId}
                                    onClick={this.showUploader}
                                    applySubmittedBio={(arg) =>
                                        this.applySubmittedBio(arg)
                                    }
                                    methodInApp={(arg) => this.methodInApp(arg)}
                                    toggleModal={() => this.toggleModal()}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users/"
                            render={() => <FindPeople />}
                        />

                        {this.state.uploaderIsVisible && (
                            <Uploader
                                methodInApp={(arg) => this.methodInApp(arg)}
                                toggleModal={() => this.toggleModal()}
                            />
                        )}
                        <Route
                            exact
                            path="/friends"
                            render={() => <Friends />}
                        />
                        <Route path="/chat" component={Chat} />
                        <Route
                            exact
                            path="/movies/:movieId"
                            render={(props) => (
                                <Movies
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/movies" component={Movie} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
