import React from "react";
import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ResetPassword from "./reset";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value & name", e.target.value);
        console.log("e.target.name", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    submit() {
        axios.post("/login", this.state).then(({ data }) => {
            console.log("reponse:", data);
            if (data.success) {
                location.replace("/");
                console.log("logged in");
            } else {
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div id="login">
                {this.state.error && (
                    <div className="wrong">Ooooops something went wrong</div>
                )}

                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />

                <button onClick={() => this.submit()}>Login</button>
                <HashRouter>
                    <div id="forgot">
                        <Route exact path="/reset" component={ResetPassword} />
                        <Link to="/reset">Forgot your password?</Link>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
