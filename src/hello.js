import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Hello() {
    const [first, setFirst] = useState("Andrea");
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        console.log(`"${first}" has been renderd in ueseeffevt`);
    }, []);

    useEffect(() => {
        console.log("useeffect runs");
        axios
            .get(`http://flame-egg.glitch.me/?q=${country}`)
            .then(({ data }) => {
                console.log("data from flame egg", data);
                setCountries(data);
            });

        return () => {
            console.log(`about to replave ${country} with a new value`);
        };
    }, [country]);

    return (
        <div>
            <p>Hello {first} ! We re learning HOOKS</p>
            <input onChange={(e) => setFirst(e.target.value)} />
            <input onChange={(e) => setCountry(e.target.value)} />
            <ul>
                {countries.map((eachCountry) => (
                    <li key={eachCountry}>{eachCountry}</li>
                ))}
            </ul>
        </div>
    );
}
