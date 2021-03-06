export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    if (action.type === "ACCEPT_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((user) => {
                if (user.id == action.newFriendId) {
                    return { ...user, accepted: true };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type === "END_FRIENDSHIP") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (user) => user.id != action.friendNoMoreId
            ),
        };
    }

    if (action.type === "MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
        };
    }

    if (action.type === "MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
    }

    if (action.type === "WALL") {
        state = {
            ...state,
            posts: action.posts,
        };
    }

    if (action.type === "NEW_POST") {
        state = {
            ...state,
            posts: [action.post, ...state.posts],
        };
    }

    if (action.type === "MOVIE_WALL") {
        state = {
            ...state,
            moviePosts: action.moviePosts,
        };
    }

    if (action.type === "NEW_MOVIE_POST") {
        state = {
            ...state,
            moviePosts: [action.moviePost, ...state.moviePosts],
        };
    }

    return state;
}
