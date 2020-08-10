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
        const otheruserId = this.props.match.params.id;
        axios.get("/api/user/" + otheruserId, this.state).then(({ data }) => {
            if (data.usersOwnProfile) {
                this.props.history.push("/");
            } else {
                this.setState(data);
                for (var i = 0; i < this.state.faves.length; i++) {
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
                        className="big-profile"
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
                    <div className="fave-container">
                        <p>{this.state.first}'s favorite movies</p>
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
                        <p>{this.state.first} hasn't liked any movies yet</p>
                    </div>
                )}
                {this.state.friendship && (
                    <>
                        <div className="friends-of-friends">
                            <p>Friends of {this.state.first}</p>
                            <div className="friends-of-friends-container">
                                {this.state.friends.map((eachFriend) => (
                                    <div key={eachFriend.id} id="eachFriend">
                                        <div className="box">
                                            <div className="boxes">
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                            </div>
                                            <Link to={"/user/" + eachFriend.id}>
                                                {eachFriend.profile_pic && (
                                                    <img
                                                        src={
                                                            eachFriend.profile_pic
                                                        }
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/default.jpg")
                                                        }
                                                    />
                                                )}
                                                {eachFriend.profile_pic ==
                                                    null && (
                                                    <img src="./default.jpg" />
                                                )}
                                                <div className="noDeco">
                                                    {eachFriend.first}{" "}
                                                    {eachFriend.last}
                                                </div>
                                            </Link>
                                            <div className="boxes">
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                                <span className="small_box"></span>
                                            </div>
                                        </div>
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
