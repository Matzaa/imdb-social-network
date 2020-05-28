import React from "react";

export default function Profilepic({ first, imageUrl }) {
    imageUrl = imageUrl || "/default.jpg";
    var hours = new Date().getHours();

    return (
        <div id="profilepic">
            <h2>
                Good
                {hours < 12 && hours >= 5 && <span> morning </span>}
                {12 <= hours && hours < 18 && <span> afternoon </span>}
                {hours >= 18 && <span> evening </span>}
                {hours < 5 && <span> evening </span>}
                {first} !
            </h2>

            <img
                src={imageUrl}
                onError={(e) => (e.target.src = "/default.jpg")}
            />
        </div>
    );
}
