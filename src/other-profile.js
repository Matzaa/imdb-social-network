import React from "react";
import axios from "./axios";
import FriendshipButton from "./friend-button";
import Wall from "./wall";
import PrivateChat from "./chat-private";
import { Link } from "react-router-dom";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("this.state before axios", this.state);
        console.log("this.props", this.state);
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
            }
        });
    }
    render() {
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
