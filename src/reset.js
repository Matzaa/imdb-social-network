import React from "react";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    submitReset() {
        console.log("about to submit reset");
        axios.post("/password/reset/start", this.state).then(({ data }) => {
            if (data.success) {
                console.log("resp in POST reset ", data);
                this.setState({ step: 2 });
            } else {
                this.setState({ error: true });
            }
        });
    }

    submitNew() {
        axios.post("/password/reset/verify", this.state).then(({ data }) => {
            if (data.success) {
                console.log("resp in POST verify ", data);
                this.setState({ step: 3 });
            } else {
                this.setState({ error: true });
            }
        });
    }

    render() {
        // if (this.state.step == 1) {
        //     return (
        //         <div>
        //             <input name="email"></input>
        //             <button></button>
        //         </div>
        //     );
        // } else if (this.state.step == 2) {
        //     return (
        //         <div>
        //             <input name="code"></input>
        //             <input name="pass"></input>
        //             <button></button>
        //         </div>
        //     );
        // }
        return (
            <div>
                {this.state.step == 1 && (
                    <div className="reset">
                        <h2 className="reset-text">Reset my password</h2>
                        {this.state.error && (
                            <div>Ooooops something went wrong</div>
                        )}
                        <input
                            name="email"
                            placeholder="email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button
                            className="reset-btn"
                            onClick={() => this.submitReset()}
                        >
                            reset
                        </button>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div className="reset">
                        <h2 className="reset-text">Reset my password</h2>
                        {this.state.error && (
                            <div>Ooooops something went wrong</div>
                        )}
                        <input
                            name="code"
                            placeholder="secret code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            name="password"
                            placeholder="new password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button
                            className="reset-btn"
                            onClick={() => this.submitNew()}
                        >
                            reset password
                        </button>
                    </div>
                )}
                {this.state.step == 3 && (
                    <div className="reset">
                        <h2 className="reset-text">Reset my password</h2>
                        {this.state.error && (
                            <div>Ooooops something went wrong</div>
                        )}
                        <h1>Success!</h1>
                    </div>
                )}
            </div>
        );
    }
}
