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
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                this.props.methodInApp(data.file);
                this.props.toggleModal();
            })
            .catch((err) => {
                console.log("err in post upload", err);
            });
    }

    handleChange(e) {
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
