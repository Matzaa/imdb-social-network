import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function MovieButton({ userId, movieId }) {
    console.log("userid", userId);
    const [buttonText, setButtonText] = useState("like movie");

    useEffect(() => {
        let abort;
        axios
            .get(`/movieRelationship/${userId}/${movieId}`)
            .then(({ data }) => {
                console.log("resp in movie button:", data);
                if (!abort) {
                    setButtonText(data.buttonText);
                }
            });
        return () => {
            abort = true;
        };
    }, []);

    function like() {
        axios
            .post(`/like`, {
                buttonText: buttonText,
                userId: userId,
                movieId: movieId,
            })
            .then(({ data }) => {
                console.log("data from friendbutton:", data);
                setButtonText(data.buttonText);
            });
        return [buttonText, like];
    }

    return (
        <div>
            <button className="movie-button" onClick={like}>
                {buttonText}
            </button>
        </div>
    );
}
