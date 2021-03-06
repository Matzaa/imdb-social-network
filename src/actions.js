import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("data in wannabe friends", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function acceptFriendRequest(otherUserId) {
    await axios.post("/acceptFriendRequest", { otherUserId });
    console.log("acceptfriendrequest axios post");
    return {
        type: "ACCEPT_REQUEST",
        newFriendId: otherUserId,
    };
}

export async function unfriend(otherUserId) {
    await axios.post("/endFriendship", { otherUserId });
    console.log("unfriend axios post");
    return {
        type: "END_FRIENDSHIP",
        friendNoMoreId: otherUserId,
    };
}

export function chatMessages(msgs) {
    return {
        type: "MESSAGES",
        chatMessages: msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "MESSAGE",
        msg,
    };
}

export function wall(posts) {
    return {
        type: "WALL",
        posts,
    };
}

export function newPost(post) {
    return {
        type: "NEW_POST",
        post,
    };
}

export function movieWall(moviePosts) {
    return {
        type: "MOVIE_WALL",
        moviePosts,
    };
}

export function newMoviePostOnWall(moviePost) {
    console.log("new movie post in ACTION", moviePost);
    return {
        type: "NEW_MOVIE_POST",
        moviePost,
    };
}
// export async function getMovieLikes(movieId) {
//     const { data } = await axios.get("/api/movies/" + movieId);
//     console.log("data in GETMOVIELIKES actions", data);
//     return {
//         type: "MOVIE",
//         movie: data,
//     };
// }
