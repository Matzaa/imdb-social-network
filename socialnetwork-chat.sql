DROP TABLE IF EXISTS chat;

CREATE TABLE chat(
    message_id SERIAL PRIMARY KEY,
    message_text VARCHAR(150) NOT NULL,
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat (message_text, user_id)
VALUES
('hi good morning!', 201),
('hi how is everyone?', 10),
('thanks Im good', 99),
('happy to hear', 201),
('did you hear the news?', 23),
('what news?', 201),
('no, what?', 99);
