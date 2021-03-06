import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ResetPassword from "./reset";

export default function Welcome() {
    return (
        <div id="welcome">
            <video
                src="/moon.mp4"
                loop
                muted
                autoPlay
                poster="/still.png"
            ></video>

            <HashRouter>
                <div id="welcome-modal">
                    <div id="welcome-text">
                        <h1>FilmBook</h1>
                        <p>A place to connect with fellow cinephiles</p>
                    </div>
                    <i className="fas fa-film"></i>
                    <div className="register-login">
                        <Link to="/">
                            <h3>Register</h3>
                        </Link>
                        <h3> &nbsp; | &nbsp;</h3>
                        <Link to="/login">
                            <h3>Login</h3>
                        </Link>
                    </div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route exact path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
