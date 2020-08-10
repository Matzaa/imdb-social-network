import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import MovieWall from "./movie-wall";
import MovieButton from "./movie-button";

export default class Movies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieerror: null,
            movieisLoaded: false,
            movieitems: [],
            showPops: false,
        };
    }

    componentDidMount() {
        const movieId = this.props.match.params.movieId;
        fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=27336ed8`)
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        movieisLoaded: true,
                        movieitems: result,
                    });
                    axios.get("/api/movies/" + movieId).then((data) => {
                        this.setState(data);
                    });
                },

                (error) => {
                    this.setState({
                        movieisLoaded: true,
                        movieerror,
                    });
                }
            );
    }

    render() {
        const { movieerror, movieisLoaded, movieitems } = this.state;
        return (
            <div id="movie">
                {movieerror && <div>Error: {movieerror.message}</div>}
                {movieisLoaded && (
                    <div id="movie-container">
                        <div>
                            <h1>{movieitems.Title}</h1>
                            <img src={movieitems.Poster} />
                            <p>{movieitems.Plot}</p>
                            <p>directed by: {movieitems.Director} </p>
                            <p>starring {movieitems.Actors}</p>
                            <p>
                                {movieitems.Year}, {movieitems.Country}
                            </p>
                        </div>

                        {this.state.data == 0 && (
                            <div>
                                <p>Be the first to like this movie!</p>
                            </div>
                        )}
                        <MovieButton
                            userId={this.props.userId}
                            movieId={this.props.match.params.movieId}
                        />
                        <div id="likies">
                            {this.state.data && this.state.data.length > 0 && (
                                <div className="friends-of-friends">
                                    <p>This movie is liked by:</p>
                                    <div className="friends-of-friends-container">
                                        {this.state.data.map((like) => (
                                            <div key={like.id}>
                                                <div className="box">
                                                    <div className="boxes">
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                    </div>
                                                    <Link
                                                        to={"/user/" + like.id}
                                                    >
                                                        <img
                                                            src={
                                                                like.profile_pic
                                                            }
                                                            onError={(e) =>
                                                                (e.target.src =
                                                                    "/default.jpg")
                                                            }
                                                        />

                                                        <div className="noDeco">
                                                            {like.first}{" "}
                                                            {like.last}
                                                        </div>
                                                    </Link>
                                                    <div className="boxes">
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                        <span className="small_box"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <MovieWall
                            userId={this.props.userId}
                            movieId={movieitems.imdbID}
                        />
                    </div>
                )}
            </div>
        );
    }
}
