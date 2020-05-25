import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submitBio() {
        axios.post("/updatebio", this.state).then(({ data }) => {
            console.log("data.bio in submitbio", data.bio);
            this.props.applySubmittedBio(data.bio);
            this.props.toggleEditbio();
        });
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name);

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state in handlechange", this.state)
        );
    }

    render() {
        return (
            <div id="bioeditor">
                <textarea
                    name="bio"
                    type="text"
                    defaultValue={this.props.bio}
                    onChange={(e) => this.handleChange(e)}
                ></textarea>
                <button onClick={() => this.submitBio()}>SUBMIT BIO</button>
            </div>
        );
    }
}
