import React from "react";
import axios from "./axios";
import FriendshipButton from "./friend-button";
import Wall from "./wall";
import PrivateChat from "./chat-private";
import { Link } from "react-router-dom";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posters: [],
            error: null,
            isLoaded: false,
        };
    }

    componentDidMount() {
        console.log("this.state before axios", this.state);

        console.log("this.props", this.props);
        const otheruserId = this.props.match.params.id;
        axios.get("/api/user/" + otheruserId, this.state).then(({ data }) => {
            console.log("data in axios mount", data);
            if (data.usersOwnProfile) {
                this.props.history.push("/");
            } else {
                this.setState(data);
                console.log(
                    "this.state after axios in OTHERPROFILE",
                    this.state
                );
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
            }
        });
        // console.log("POSTERS", posters);
    }

    render() {
        console.log("AFTER ALL", this.state);
        return (
            <div id="otherprofile">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <div className="profile-element">
                    <img
                        src={this.state.imageUrl}
                        onError={(e) => (e.target.src = "/default.jpg")}
                    />
                    <div className="profile-element-2">
                        <p>{this.state.bio}</p>
                        <FriendshipButton
                            otheruserId={this.props.match.params.id}
                            className="friend-button"
                        />
                    </div>
                </div>
                {this.state.faves && this.state.faves.length > 0 && (
                    <div>
                        <p>{this.state.first}'s favorite movies</p>
                        {this.state.posters.map((poster) => (
                            <div key={poster.imdbID}>
                                <img src={poster.Poster} />
                            </div>
                        ))}
                    </div>
                )}
                {this.state.friendship && (
                    <>
                        <div id="friends-of-friends">
                            <p>Friends of {this.state.first}</p>
                            <div id="friends-of-friends-container">
                                {this.state.friends.map((eachFriend) => (
                                    <div key={eachFriend.id} id="eachFriend">
                                        <Link to={"/user/" + eachFriend.id}>
                                            {eachFriend.profile_pic && (
                                                <img
                                                    src={eachFriend.profile_pic}
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/default.jpg")
                                                    }
                                                />
                                            )}
                                            {eachFriend.profile_pic == null && (
                                                <img src="./default.jpg" />
                                            )}
                                            <div className="noDeco">
                                                {eachFriend.first}{" "}
                                                {eachFriend.last}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Wall otheruserId={this.props.match.params.id} />
                        {/* <PrivateChat otheruserId={this.props.match.params.id} /> */}
                    </>
                )}
            </div>
        );
    }
}
