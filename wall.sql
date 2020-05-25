CREATE TABLE wall(
    id SERIAL PRIMARY KEY,
    post VARCHAR(255) NOT NULL,
    wall_owner_id INT NOT NULL,
    poster_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO wall (post, poster_id, wall_owner_id)
VALUES
('this is my first ever post, its amazing', 201, 201),
('Im posting on my own wall Im so cool', 202, 202),
('hey Gary this is a post for you', 202, 11)