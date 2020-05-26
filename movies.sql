DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS movie_wall;

CREATE TABLE movies(
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_wall(
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR NOT NULL,
    commenter_id INT NOT NULL,
    comment VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

INSERT INTO movies (movie_id, user_id)
VALUES
('tt0062622', 202),
('tt0062622', 201),
('tt0062622', 10),
('tt0062622', 100),
('tt2056771', 201),
('tt2056771', 10),
('tt0053291', 202),
('tt0053291', 201);

INSERT INTO movie_wall (movie_id, commenter_id, comment)
VALUES 
('tt0062622', 202, 'wow this is my all time fave!'),
('tt0062622', 2, 'it is ok, but I think there is much better'),
('tt0062622', 99, 'its my favorite too!!!!!!!!'),
('tt2056771', 10, 'has anyone lese seen this?'),
('tt2056771', 99, 'yeah, I love it!')
