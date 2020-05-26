const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

//------------------------- register ------------------------------------
module.exports.addData = (first, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first, last, email;
    `,
        [first, last, email, password]
    );
};

//------------------------- login ------------------------------------
module.exports.getUserByEmail = (email) => {
    return db.query(
        `
         SELECT * FROM users WHERE users.email = $1;
         `,
        [email]
    );
};

//------------------------- set new pw ------------------------------------
module.exports.addCode = (email, code) => {
    return db.query(
        `
    INSERT INTO crypto (email, code)
    VALUES ($1, $2)
    RETURNING email, code;
        `,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT * FROM crypto WHERE crypto.email = $1;
        `,
        [email]
    );
};

module.exports.updatePassword = (email, hashedPw) => {
    return db.query(
        `
        UPDATE users SET password = $2 WHERE email = $1;
        `,
        [email, hashedPw]
    );
};

//------------------------- update profile_pic ------------------------------------
module.exports.updateImage = (url, userId) => {
    return db.query(
        `
        UPDATE users SET profile_pic = $1 WHERE id = $2
        RETURNING profile_pic;
        `,
        [url, userId]
    );
};

//------------------------- update bio ------------------------------------
module.exports.updateBio = (bio, userId) => {
    return db.query(
        `
        UPDATE users SET bio = $1 WHERE id = $2
        RETURNING bio;
        `,
        [bio, userId]
    );
};

//------------------------- otherprofile ------------------------------------
module.exports.getUserById = (id) => {
    return db.query(
        `
         SELECT * FROM users WHERE id = $1;
         `,
        [id]
    );
};

module.exports.getUsersFriends = (userId) => {
    return db.query(
        `
        SELECT users.id, users.first, users.last, users.profile_pic 
        FROM friendships
        JOIN users
        ON (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id);
        `,
        [userId]
    );
};

//------------------------- find people ------------------------------------

module.exports.topThree = () => {
    return db.query(
        `
        SELECT * FROM users 
        ORDER BY id DESC LIMIT 3;
        `
    );
};

module.exports.getMatch = (val) => {
    return db.query(
        `
        SELECT * FROM users
        WHERE first ILIKE $1;
        `,
        [val + "%"]
    );
};

//------------------------- friendship status ------------------------------------
module.exports.getFriendship = (userId, friendId) => {
    return db.query(
        `
        SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        
        `,
        [userId, friendId]
    );
};

module.exports.sendRequest = (userId, friendId) => {
    return db.query(
        `
    INSERT INTO friendships (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING sender_id, receiver_id;
        `,
        [userId, friendId]
    );
};

module.exports.acceptRequest = (userId, friendId) => {
    return db.query(
        `
        UPDATE friendships SET accepted = true 
        WHERE (receiver_id = $1 AND sender_id = $2);
        `,
        [userId, friendId]
    );
};

module.exports.deleteFriendship = (userId, friendId) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        `,
        [userId, friendId]
    );
};

module.exports.areWeFriends = (userId, friendId) => {
    return db.query(
        `
        SELECT * FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        AND accepted = true;      
        `,
        [userId, friendId]
    );
};

//------------------------- friends ------------------------------------

module.exports.getAllFriendlies = (userId) => {
    return db.query(
        `
      SELECT users.id, first, last, profile_pic, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND receiver_id = users.id);
  `,
        [userId]
    );
};

//------------------------- chat ------------------------------------

module.exports.getLastTenMessages = () => {
    return db.query(
        `
        SELECT users.first, users.last, users.profile_pic, chat.message_text, chat.message_id, chat.created_at
        FROM chat
        JOIN users
        ON chat.user_id = users.id
        ORDER BY chat.message_id DESC LIMIT 10;
        `
    );
};

module.exports.addChat = (message, userId) => {
    return db.query(
        `
        INSERT INTO chat (message_text, user_id)
        VALUES ($1, $2)
        RETURNING message_text, message_id, created_at;
        `,
        [message, userId]
    );
};

module.exports.getLastChatter = (userId) => {
    return db.query(
        `
        SELECT first, last, profile_pic
        FROM users
        WHERE id = $1;
        `,
        [userId]
    );
};

//------------------------- wall ------------------------------------

module.exports.getWall = () => {
    return db.query(
        `
        SELECT users.first, users.last, users.profile_pic, wall.id, wall.post, wall.created_at, wall.wall_owner_id
        FROM users 
        JOIN wall
        ON users.id = wall.poster_id
        ORDER BY wall.id DESC;
        `
    );
};

module.exports.addPost = (post, wallId, userId) => {
    return db.query(
        `
        INSERT INTO wall (post, wall_owner_id, poster_id)
        VALUES ($1, $2, $3)
        RETURNING post, wall_owner_id, poster_id, created_at;
        `,
        [post, wallId, userId]
    );
};

module.exports.userInfoForWall = (userId) => {
    return db.query(
        `
        SELECT first, last, profile_pic
        FROM users 
        WHERE id = $1;
        `,
        [userId]
    );
};

//----------------------- movies -------------------------------------
module.exports.getMovieLikes = (movieId) => {
    return db.query(
        `
        SELECT users.id, users.first, users.last, users.profile_pic
        FROM users
        JOIN movies 
        ON (users.id = movies.user_id)
        WHERE movie_id = $1;
        `,
        [movieId]
    );
};

module.exports.getPopulars = () => {
    return db.query(
        `
        SELECT movie_id,
        COUNT(movie_id) AS value_occurrence 
        FROM movies
        GROUP BY movie_id
        ORDER BY value_occurrence  DESC
        LIMIT 3;
        `
    );
};

module.exports.getMovieWall = () => {
    return db.query(
        `
        SELECT users.first, users.last, users.profile_pic, movie_wall.id, movie_wall.comment, movie_wall.created_at, movie_wall.commenter_id, movie_wall.movie_id
        FROM users 
        JOIN movie_wall
        ON users.id = movie_wall.commenter_id
        ORDER BY movie_wall.id DESC;
        `
    );
};

module.exports.addMovieComment = (comment, movieId, userId) => {
    return db.query(
        `
        INSERT INTO movie_wall (comment, movie_id, commenter_id)
        VALUES ($1, $2, $3)
        RETURNING comment, commenter_id, movie_id, created_at;
        `,
        [comment, movieId, userId]
    );
};
