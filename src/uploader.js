import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("uploader mounted");
    }

    methodInUploader() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        console.log("file", this.state.file);
        console.log("formdata", formData);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log("data.file in post upload", data.file);
                this.props.methodInApp(data.file);
                this.props.toggleModal();
            })
            .catch((err) => {
                console.log("err in post upload", err);
            });
    }

    handleChange(e) {
        console.log("e.target.value & name", e.target.value);
        console.log("e.target.name", e.target.name);
        console.log("e.target.files", e.target.files);
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this.state in handlechange", this.state)
        );
    }

    render() {
        return (
            <div className="uploader-box">
                <div className="uploader">
                    <h1 className="uploader-text">upload a profile picture!</h1>
                    <h1 onClick={() => this.props.toggleModal()} id="x">
                        X
                    </h1>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        className="inputfile"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.methodInUploader()}>
                        UPLOAD
                    </button>
                </div>
            </div>
        );
    }
}
