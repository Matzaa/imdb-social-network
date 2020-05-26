import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import MovieWall from "./movie-wall";

export default class Movies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
        };
    }

    // const dispatch = useDispatch();
    // const movie = useSelector((state) => state && state.movie);
    // const [error, setError] = useState(null);
    // const [isLoaded, setIsLoaded] = useState(false);
    // const [items, setItems] = useState([]);
    // const [populars, setPopulars] = useState([]);
    // const [value, onSetValue] = useQueryString("");

    // useEffect(() => {
    //     console.log("movies mounted");
    //     axios.get("/movies/all").then(({ data }) => {
    //         console.log("data in most popular movies");
    //         setPopulars(data);
    //     });
    // }, []);

    // console.log("history", this.props.history);

    componentDidMount() {
        console.log("movies mounted");
        const movieId = this.props.match.params.movieId;
        fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=27336ed8`)
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result,
                    });
                    axios.get("/api/movies/" + movieId).then((data) => {
                        console.log("data in GET MOVIE", data);
                        this.setState(data);
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

    // keyCheck = (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         console.log("value ", e.target.value);
    //         fetch(`http://www.omdbapi.com/?t=${e.target.value}&apikey=27336ed8`)
    //             .then((res) => res.json())
    //             .then(
    //                 (result) => {
    //                     console.log("result in MOVIES", result);
    //                     // setIsLoaded(true);
    //                     // setItems(result);
    //                     // onSetValue(result.imdbID);
    //                     this.setState({
    //                         isLoaded: true,
    //                         items: result,
    //                     });
    //                 },
    //                 (error) => {
    //                     this.setState({
    //                         isLoaded: true,
    //                         error,
    //                     });
    //                 }
    //             );
    //     }
    // };

    render() {
        console.log("THIS STATE!", this.state);
        console.log("THIS PROPS!", this.props);
        const { error, isLoaded, items } = this.state;
        return (
            <div id="movie">
                {error && <div>Error: {error.message}</div>}
                {isLoaded && (
                    <div id="movie-container">
                        <Link to={"/movies/" + items.imdbID}>
                            <img src={items.Poster} />
                        </Link>
                        <p>{items.Title}</p>
                        <p>This movie is liked by:</p>
                        <button>add to my favorites</button>
                        {this.state.data &&
                            this.state.data.map((like) => (
                                <div key={like.id}>
                                    <Link to={"/user/" + like.id}>
                                        <img
                                            src={like.profile_pic}
                                            onError={(e) =>
                                                (e.target.src = "/default.jpg")
                                            }
                                        />

                                        <span>
                                            {like.first} {like.last}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        <MovieWall
                            userId={this.props.userId}
                            movieId={items.imdbID}
                        />
                    </div>
                )}
            </div>
        );
    }
}
