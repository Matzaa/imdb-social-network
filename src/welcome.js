import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ResetPassword from "./reset";

export default function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                <div id="welcome-modal">
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
