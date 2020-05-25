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
