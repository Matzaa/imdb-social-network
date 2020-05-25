import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton({ otheruserId }) {
    console.log("other id", otheruserId);
    const [buttonText, setButtonText] = useState("make friend req");

    useEffect(() => {
        let abort;
        console.log("im friendbutton compo mounting");
        axios.get(`/friendshipstatus/${otheruserId}`).then(({ data }) => {
            console.log("resp in friendbutton:", data);
            if (!abort) {
                setButtonText(data.buttonText);
            }
        });
        return () => {
            abort = true;
        };
    }, []);

    function submit() {
        console.log("I clicked the button and text is", buttonText);
        axios
            .post(`/send-friend-request/${otheruserId}/${buttonText}`)
            .then(({ data }) => {
                console.log("data from friendbutton:", data);
                setButtonText(data.buttonText);
            });
        return [buttonText, submit];
    }

    return (
        <div>
            <button className="friend-button" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
