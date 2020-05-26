DROP TABLE IF EXISTS pm;

CREATE TABLE pm(
    id SERIAL PRIMARY KEY,
        message VARCHAR(255) NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pm (message, sender_id, receiver_id)
VALUES
('hey Gary how are you?', 202, 11),
('Im good and you?', 11, 202),
('alright I guess', 202, 11),
('Hi Angela!', 202, 15),
('hey Pandora, good to hear from you!', 15, 202)