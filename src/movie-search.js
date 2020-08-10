import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            populars: [],
            posters: [],
        };
        this.keyCheck = this.keyCheck.bind(this);
    }

    componentDidMount() {
        axios
            .get("/populars")
            .then(({ data }) => {
                for (var i = 0; i < data.populars.length; i++) {
                    fetch(
                        `http://www.omdbapi.com/?i=${data.populars[i].movie_id}&apikey=27336ed8`
                    )
                        .then((res) => res.json())
                        .then(
                            (result) => {
                                this.setState({
                                    isLoaded: true,

                                    posters: [...this.state.posters, result],
                                });
                            },
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error,
                                });
                            }
                        );
                }
            })
            .catch((err) => {
                console.log("err in getpops", err);
            });
    }

    keyCheck(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            fetch(`http://www.omdbapi.com/?t=${e.target.value}&apikey=27336ed8`)
                .then((res) => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            items: result,
                        });
                        this.setState({ showPops: false });
                        this.props.history.push("/movies/" + result.imdbID);
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error,
                        });
                    }
                );
            e.target.value = "";
        }
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else {
            return (
                <div id="movie-search">
                    <div className="popular-container">
                        {this.state.populars && (
                            <div className="popular-container-2">
                                <p>popular picks</p>
                                <div className="populars">
                                    {this.state.posters.map((poster) => (
                                        <div key={poster.imdbID}>
                                            <Link
                                                to={"/movies/" + poster.imdbID}
                                            >
                                                <img
                                                    className="pop-posters"
                                                    src={poster.Poster}
                                                />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            onKeyDown={this.keyCheck}
                            placeholder="search for a movie"
                        />
                    </div>
                </div>
            );
        }
    }
}
