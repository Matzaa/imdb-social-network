import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovieLikes } from "./actions";
import { Link } from "react-router-dom";
import axios from "./axios";
import Movies from "./movies";

// export default function Movie() {
export default class Movie extends React.Component {
    // const dispatch = useDispatch();
    // console.log("state in MOVIE JS", state);
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
        };
        this.keyCheck = this.keyCheck.bind(this);
    }

    componentDidMount() {
        console.log("movie-search mounted", this.state);
    }
    // useEffect(() => {
    //     console.log("search movie mounted");
    // axios.get("/movies/all").then(({ data }) => {
    //     console.log("data in most popular movies");
    //     setPopulars(data);
    // });
    // dispatch(getMovieLikes(result.imdbID));
    // }, []);

    keyCheck(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("value ", e.target.value);

            fetch(`http://www.omdbapi.com/?t=${e.target.value}&apikey=27336ed8`)
                .then((res) => res.json())
                .then(
                    (result) => {
                        console.log("result in MOVIES", result);
                        // setIsLoaded(true);
                        // setItems(result);
                        // onSetValue(result.imdbID);
                        this.setState({
                            isLoaded: true,
                            items: result,
                        });
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
            // } else if (!isLoaded) {
            //     return <div>Loading...</div>;
        } else {
            return (
                <div id="movie-search">
                    <input onKeyDown={this.keyCheck} />
                    {/* <Movies /> */}
                    {/* <div id="movie-container">
                        <Link to={"/movies/" + items.imdbID}>
                            <img src={items.Poster} />
                            <p>{items.Title}</p>
                        </Link>
                    </div> */}
                </div>
            );
        }
    }
}
