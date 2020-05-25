import React, { useEffect } from "react";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == false)
    );
    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == true)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
        console.log("what", receiveFriendsWannabes());
    }, []);

    console.log("friends in useSelector: ", friends);
    console.log("wannabes: ", wannabes);

    return (
        <div id="friends">
            <p> MY FRIENDS</p>
            <div id="myfriends">
                {friends &&
                    friends.map((eachFriend) => (
                        <div key={eachFriend.id}>
                            <Link to={"/user/" + eachFriend.id}>
                                <img
                                    src={eachFriend.profile_pic}
                                    onError={(e) =>
                                        (e.target.src = "/default.jpg")
                                    }
                                />
                                <div className="noDeco">
                                    {eachFriend.first}
                                    {eachFriend.last}
                                </div>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(unfriend(eachFriend.id))
                                }
                            >
                                end friendship
                            </button>
                        </div>
                    ))}
            </div>
            <p>FRIEND REQUESTS</p>
            <div id="friend-requests">
                {wannabes &&
                    wannabes.map((eachWannabe) => (
                        <div key={eachWannabe.id}>
                            <Link to={"/user/" + eachWannabe.id}>
                                <img
                                    src={eachWannabe.profile_pic}
                                    onError={(e) =>
                                        (e.target.src = "/default.jpg")
                                    }
                                />
                                <div className="noDeco">
                                    {eachWannabe.first}
                                    {eachWannabe.last}
                                </div>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(
                                        acceptFriendRequest(eachWannabe.id)
                                    )
                                }
                            >
                                accept friend request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
