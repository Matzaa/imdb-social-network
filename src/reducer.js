export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
        //     state = Object.assign({}, state, {
        //         friendsWannabes: action.friendsWannabes,
        //     });
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
    console.log("state in reducer", state);

    console.log("chatmessages in reduder", state.chatMessages);
    return state;
}
