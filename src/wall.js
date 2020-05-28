import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Wall({ userId, otheruserId }) {
    const posts = useSelector((state) => state && state.posts);

    useEffect(() => {
        console.log("wall mounted");
        console.log("userId in WALL", userId);
        console.log("otheruserId in WALL", otheruserId);
    });

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); //prevents going to the next line
            console.log("value ", e.target.value);
            let infoToEmit = { post: e.target.value, otheruserId };
            console.log("object that will be emitted", infoToEmit);
            socket.emit("post to wall", infoToEmit);
            e.target.value = "";
        }
    };

    // async function loadPage() {
    //     const searchUrl = "https://www.amazon.de/";
    //     const response = await fetch(searchUrl);
    //     const htmlString = await response.text();
    //     console.log("htmlString in loadpage", htmlString);
    // }

    // loadPage();

    return (
        <div className="wall">
            <textarea
                placeholder="post on my wall!"
                onKeyDown={keyCheck}
            ></textarea>
            <div>
                {posts &&
                    posts.map((eachPost) => (
                        <div key={eachPost.id}>
                            {userId == eachPost.wall_owner_id && (
                                <div className="individual-post">
                                    <img
                                        src={eachPost.profile_pic}
                                        onError={(e) =>
                                            (e.target.src = "/default.jpg")
                                        }
                                    />
                                    <div className="post-element">
                                        <h2>{eachPost.post}</h2>
                                        <span>
                                            said {eachPost.first}{" "}
                                            {eachPost.last}
                                        </span>
                                        <span> at {eachPost.created_at}</span>
                                    </div>
                                </div>
                            )}
                            {otheruserId == eachPost.wall_owner_id && (
                                <div className="individual-post">
                                    <img
                                        src={eachPost.profile_pic}
                                        onError={(e) =>
                                            (e.target.src = "/default.jpg")
                                        }
                                    />
                                    <div className="post-element">
                                        <h2>{eachPost.post}</h2>
                                        <span>
                                            {" "}
                                            said
                                            {eachPost.first} {eachPost.last}
                                        </span>
                                        <span> at {eachPost.created_at}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
