import * as io from "socket.io-client";

import {
    chatMessages,
    chatMessage,
    wall,
    newPost,
    movieWall,
    newMoviePostOnWall,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            store.dispatch(chatMessages(msgs));
        });

        // socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));

        socket.on("addChatMsg", (msg) => {
            console.log(
                `message in clientInformation, about to start the redux process by dispatching here ${msg}`
            );
            console.log("msg msg msg: ", msg);
            store.dispatch(chatMessage(msg));
        });

        socket.on("posts", (posts) => {
            store.dispatch(wall(posts));
        });

        socket.on("newPost", (post) => {
            store.dispatch(newPost(post));
        });

        socket.on("movie wall posts", (moviePosts) => {
            store.dispatch(movieWall(moviePosts));
        });

        socket.on("newMoviePost", (MoviePost) => {
            store.dispatch(newMoviePostOnWall(MoviePost));
        });
    }
};
