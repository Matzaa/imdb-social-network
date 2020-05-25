import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function PrivateChat({ otheruserId }) {
    const elemRef = useRef();
    const privateChats = useSelector((state) => state && state.privateChats);

    // useEffect(() => {
    //     elemRef.current.scrollTop =
    //         elemRef.current.scrollHeight - elemRef.current.clientHeight;
    // }, [{ privateChats }]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("private chat", { chat: e.target.value, otheruserId });
            e.target.value = "";
        }
    };

    return (
        <div id="private-chat">
            <div>all the chats</div>
            <textarea onKeyDown={keyCheck}></textarea>
        </div>
    );
}
