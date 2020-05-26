import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function MovieWall({ userId, movieId }) {
    const moviePosts = useSelector((state) => state && state.moviePosts);

    useEffect(() => {
        console.log("movie wall mounted");
        console.log("userId in WALL", userId);
        console.log("omovierId in WALL", movieId);
    });

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); //prevents going to the next line
            console.log("value ", e.target.value);
            let infoToEmit = { post: e.target.value, movieId };
            console.log("object that will be emitted", infoToEmit);
            socket.emit("post to movie wall", infoToEmit);
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
        <div id="wall">
            <textarea
                placeholder="post on my wall!"
                onKeyDown={keyCheck}
            ></textarea>
            <div>
                {moviePosts &&
                    moviePosts.map((eachPost) => (
                        <div key={eachPost.id}>
                            {movieId == eachPost.movie_id && (
                                <div className="individual-post">
                                    {/* <Link to={"/user/" + eachPost.commenter_id}> */}
                                    <img
                                        src={eachPost.profile_pic}
                                        onError={(e) =>
                                            (e.target.src = "/default.jpg")
                                        }
                                    />
                                    {/* </Link> */}
                                    <div className="post-element">
                                        <h2>{eachPost.comment}</h2>
                                        <span>
                                            said {eachPost.first}{" "}
                                            {eachPost.last}
                                        </span>

                                        <span> at {eachPost.created_at}</span>
                                    </div>
                                </div>
                            )}
                            {/* {otheruserId == eachPost.wall_owner_id && (
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
                            )} */}
                        </div>
                    ))}
            </div>
        </div>
    );
}
