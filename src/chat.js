import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        // console.log("chat hook compo has mounted ");
        // console.log("elemRef =", elemRef);
        // console.log("scroll top: ", elemRef.current.scrollTop);
        // console.log("client height: ", elemRef.current.clientHeight);
        // console.log("scroll height: ", elemRef.current.scrollHeight);

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [{ chatMessages }]);

    console.log("my last 10 msgs: ", chatMessages);

    const keyCheck = (e) => {
        console.log("key pressed ", e.key);
        if (e.key === "Enter") {
            e.preventDefault(); //prevents going to the next line
            console.log("value ", e.target.value);
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div id="chat">
            <div id="chat-messages" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((eachChat) => (
                        <div key={eachChat.message_id}>
                            <div className="individual-post">
                                <img
                                    src={eachChat.profile_pic}
                                    onError={(e) =>
                                        (e.target.src = "/default.jpg")
                                    }
                                />
                                <div className="post-element">
                                    <h2>{eachChat.message_text}</h2>
                                    <span>
                                        said {eachChat.first} {eachChat.last}
                                    </span>
                                    <span> at {eachChat.created_at}</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
