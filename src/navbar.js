import React from "react";
// import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div id="navbar">
            <Link to="/users">find friends</Link>
            {/* <Link to="/logout">logout</Link> */}
            <Link to="/friends">friends</Link>
            <Link to="/">profile</Link>
            <Link to="/chat">chat</Link>
            <a href="/logout">logout</a>
        </div>
    );
}
