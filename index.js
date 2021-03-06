const express = require("express");
const app = express();
// socket:
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// - - - -
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const config = require("./config.json");
//------------------------------------------------------------------
//--------------------- image upload boilerplate -------------------
//------------------------------------------------------------------
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//-------Date fixer ------------
const prettierDate = (posttime) => {
    return (posttime = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "Etc/GMT",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(posttime));
};

//------------------------------------------------------------------
//--------------------- MIDDLEWARE ---------------------------------
//------------------------------------------------------------------
app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//------------------------------------------------------------------
//--------------------------- ROUTES -------------------------------
//------------------------------------------------------------------

//========================= START ================================
app.post("/register", (req, res) => {
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({ success: false });
    } else {
        hash(req.body.password).then((hashedPw) => {
            db.addData(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((response) => {
                    req.session = {
                        first: response.rows[0].first,
                        last: response.rows[0].last,
                        email: response.rows[0].email,
                        userId: response.rows[0].id,
                        imageUrl: response.rows[0].imageUrl,
                    };
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("err in POST register", err);
                });
        });
    }
});

app.post("/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false });
    } else {
        db.getUserByEmail(req.body.email)
            .then((results) => {
                const hashedPw = results.rows[0].password;
                compare(req.body.password, hashedPw).then((matchValue) => {
                    if (matchValue) {
                        req.session = {
                            first: results.rows[0].first,
                            last: results.rows[0].last,
                            email: results.rows[0].email,
                            userId: results.rows[0].id,
                            imageUrl: results.rows[0].profile_pic,
                            bio: results.rows[0].bio,
                        };
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                });
            })
            .catch((err) => {
                console.log("err in getUser in POSTlogin", err);
            });
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", (req, res) => {
    console.log("cookie in /user", req.session);

    res.json(req.session);
});
//========================= PW RESET ================================

app.post("/password/reset/start", (req, res) => {
    let email = req.body.email;
    db.getUserByEmail(email)
        .then((results) => {
            if (results.rows.length < 1) {
                res.json({ error: true });
            } else {
                const secretCode = cryptoRandomString({ length: 6 });
                db.addCode(email, secretCode)
                    .then(() =>
                        sendEmail(
                            email,
                            "reset code",
                            `Your reset code is ${secretCode}, enjoy`
                        ).then(() => res.json({ success: true }))
                    )
                    .catch((err) => {
                        console.log("err in addCode", err);
                    });
            }
        })
        .catch((err) => {
            console.log("err in getUserbyEmail ", err);
        });
});

app.post("/password/reset/verify", (req, res) => {
    let email = req.body.email;
    let code = req.body.code;
    db.getCode(email).then((results) => {
        if (results.rows.length < 1) {
            res.json({ error: true });
        } else {
            let last = results.rows.length - 1;
            if (results.rows[last].code === code) {
                hash(req.body.password)
                    .then((hashedPw) => {
                        db.updatePassword(email, hashedPw)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("err in reset update PW", err);
                            });
                    })
                    .catch((err) => {
                        console.log("err in reset pw hash", err);
                    });
            } else {
                res.json({ error: true });
            }
        }
    });
});

//========================= UPLOAD BIO, PROFILEPIC ================================

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let url = config.s3Url + req.file.filename;
    db.updateImage(url, req.session.userId)
        .then((results) => {
            console.log("results db updateImg", results);
            req.session.imageUrl = results.rows[0].profile_pic;
            res.json({ file: results.rows[0].profile_pic });
        })
        .catch((err) => {
            console.log("err in dbudate img", err);
        });
});

app.post("/updatebio", (req, res) => {
    db.updateBio(req.body.bio, req.session.userId).then((results) => {
        req.session.bio = results.rows[0].bio;
        console.log("cookie in updatebio", req.session);
        res.json({ bio: results.rows[0].bio });
    });
});

// ========================== FIND-PEOPLE ================================

app.get("/api/user/:id", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({ usersOwnProfile: true });
    } else {
        db.areWeFriends(req.session.userId, req.params.id)
            .then((results) => {
                var friendshipstatus = {};
                if (results.rows.length > 0) {
                    friendshipstatus.friendship = true;
                } else {
                    friendshipstatus.friendship = false;
                }
                db.getUsersFriends(req.params.id)
                    .then(({ rows }) => {
                        var userFriends = {};
                        if (rows.length < 1) {
                            userFriends = {};
                        } else {
                            userFriends = { friends: rows };
                        }

                        db.getFaveMovies(req.params.id)
                            .then((results) => {
                                var faveMovies = { faves: results.rows };
                                db.getUserById(req.params.id)
                                    .then((results) => {
                                        res.json({
                                            ...faveMovies,
                                            ...userFriends,
                                            ...friendshipstatus,
                                            usersOwnProfile: false,
                                            first: results.rows[0].first,
                                            last: results.rows[0].last,
                                            imageUrl:
                                                results.rows[0].profile_pic,
                                            bio: results.rows[0].bio,
                                        });
                                    })
                                    .catch((err) => {
                                        console.log("err in getUserbyId", err);
                                    });
                            })
                            .catch((err) => {
                                console.log("err in getFAVES", err);
                            });
                    })
                    .catch((err) => {
                        console.log("err in frienddss friendss", err);
                    });
            })
            .catch((err) => {
                console.log("err in are we friends", err);
            });
    }
});

app.get("/api/users", (req, res) => {
    db.topThree()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in topThree", err);
        });
});

app.get("/api/users/:users", (req, res) => {
    db.getMatch(req.params.users)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getMatch", err);
        });
});

// ========================== FRIENDSHIP REQ BUSINESS ================================

app.get("/friendshipstatus/:otheruserId", (req, res) => {
    db.getFriendship(req.session.userId, req.params.otheruserId)
        .then((results) => {
            if (results.rows == 0) {
                res.json({ buttonText: "send friend request :)" });
            } else if (results.rows[0].accepted) {
                res.json({ buttonText: "unfriend :(" });
            } else {
                if (results.rows[0].sender_id == req.session.userId) {
                    res.json({ buttonText: "cancel friend request :(" });
                } else {
                    res.json({ buttonText: "accept friend request :)" });
                }
            }
        })
        .catch((err) => {
            console.log("err in getFriendship", err);
        });
});

app.post("/send-friend-request/:otheruserId/:buttonText", (req, res) => {
    if (req.params.buttonText == "send friend request :)") {
        return db
            .sendRequest(req.session.userId, req.params.otheruserId)
            .then(() => {
                console.log("friend req sent!!!!");
                res.json({ buttonText: "cancel friend request :(" });
            })
            .catch((err) => {
                "err in sendReq", err;
            });
    } else if (
        req.params.buttonText == "cancel friend request :(" ||
        req.params.buttonText == "unfriend :("
    ) {
        db.deleteFriendship(req.session.userId, req.params.otheruserId)
            .then(() => {
                console.log("friendship deleted");
                res.json({ buttonText: "send friend request :)" });
            })
            .catch((err) => {
                "err in deleteFriendship", err;
            });
    } else if (req.params.buttonText == "accept friend request :)") {
        return db
            .acceptRequest(req.session.userId, req.params.otheruserId)
            .then(() => {
                console.log("friendship accepted");
                res.json({ buttonText: "unfriend :(" });
            })
            .catch((err) => {
                "err in acceptReq", err;
            });
    }
});

//================================= FRIENDS =======================================

app.get("/friends-wannabes", (req, res) => {
    db.getAllFriendlies(req.session.userId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getallfriendlies", err);
        });
});

app.post("/acceptFriendRequest", (req, res) => {
    return db
        .acceptRequest(req.session.userId, req.body.otherUserId)
        .then((results) => {
            console.log("friendship accepted");
            res.json(results.rows[0]);
        })
        .catch((err) => {
            "err in acceptReq", err;
        });
});

app.post("/endFriendship", (req, res) => {
    db.deleteFriendship(req.session.userId, req.body.otherUserId)
        .then((results) => {
            console.log("friendship deleted");
            res.json(results.rows[0]);
        })
        .catch((err) => {
            "err in deleteFriendship", err;
        });
});

//================================= MOVIES =======================================

app.get("/api/movies/:movieId", (req, res) => {
    db.getMovieLikes(req.params.movieId)
        .then((results) => {
            console.log("getMovieLikes:", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getMovieLikes", err);
        });
});

app.get("/faveMovies/:userId", (req, res) => {
    db.getFaveMovies(req.params.userId)
        .then((results) => {
            var faveMovies = { faves: results.rows };
            res.json({ ...faveMovies });
        })
        .catch((err) => {
            console.log("err in faveMovies", err);
        });
});

app.get("/movieRelationship/:userId/:movieId", (req, res) => {
    db.getMovieRealtionship(req.params.movieId, req.params.userId)
        .then((results) => {
            if (results.rowCount == 0) {
                res.json({ buttonText: "add to favorites" });
            } else {
                res.json({ buttonText: "remove from favorites" });
            }
        })
        .catch((err) => {
            console.log("err in getMovieRelationship", err);
        });
});

app.post("/like", (req, res) => {
    if (req.body.buttonText == "add to favorites") {
        db.likeMovie(req.body.movieId, req.body.userId)
            .then(() => {
                res.json({ buttonText: "remove from favorites" });
            })
            .catch((err) => {
                console.log("err in likeMovie", err);
            });
    } else if (req.body.buttonText == "remove from favorites") {
        db.removeMovie(req.body.movieId, req.body.userId)
            .then(() => {
                res.json({ buttonText: "add to favorites" });
            })
            .catch((err) => {
                console.log("err in remove movie", err);
            });
    }
});
app.get("/populars", (req, res) => {
    db.getPopulars().then((results) => {
        res.json({ populars: results.rows });
    });
});

//===============================================================================

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

// ================== SOCKET =============================
io.on("connection", function (socket) {
    console.log(`socket with id ${socket.id} is now connected`);

    //if user isnt logged in, disconnect them from sockets
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    db.getLastTenMessages()
        .then((results) => {
            for (let i = 0; i < results.rows.length; i++) {
                results.rows[i].created_at = prettierDate(
                    results.rows[i].created_at
                );
            }
            io.sockets.emit("chatMessages", results.rows.reverse());
        })
        .catch((err) => {
            console.log("err in getLast10", err);
        });

    db.getWall()
        .then((results) => {
            for (let i = 0; i < results.rows.length; i++) {
                results.rows[i].created_at = prettierDate(
                    results.rows[i].created_at
                );
            }
            io.sockets.emit("posts", results.rows);
        })
        .catch((err) => {
            console.log("err in getWall", err);
        });

    db.getMovieWall()
        .then((results) => {
            for (let i = 0; i < results.rows.length; i++) {
                results.rows[i].created_at = prettierDate(
                    results.rows[i].created_at
                );
            }
            io.sockets.emit("movie wall posts", results.rows);
        })
        .catch((err) => {
            console.log("err in get moviaewall", err);
        });

    socket.on("My amazing chat message", (newMsg) => {
        db.addChat(newMsg, userId)
            .then((addChatResults) => {
                for (let i = 0; i < addChatResults.rows.length; i++) {
                    addChatResults.rows[i].created_at = prettierDate(
                        addChatResults.rows[i].created_at
                    );
                }
                db.getLastChatter(userId)
                    .then((results) => {
                        let newMessageObj = {
                            ...addChatResults.rows[0],
                            ...results.rows[0],
                        };

                        io.sockets.emit("addChatMsg", newMessageObj);
                    })
                    .catch((err) => {
                        console.log("err in getLastChatter", err);
                    });
            })
            .catch((err) => {
                console.log("err in addchat", err);
            });
    });

    socket.on("post to wall", (info) => {
        let wallOwner;
        if (!info.otheruserId) {
            wallOwner = userId;
        } else {
            wallOwner = info.otheruserId;
        }
        db.addPost(info.post, wallOwner, userId)
            .then((postInfoFromWall) => {
                for (let i = 0; i < postInfoFromWall.rows.length; i++) {
                    postInfoFromWall.rows[i].created_at = prettierDate(
                        postInfoFromWall.rows[i].created_at
                    );
                }
                db.userInfoForWall(userId)
                    .then((results) => {
                        let newPost = {
                            ...postInfoFromWall.rows[0],
                            ...results.rows[0],
                        };
                        io.sockets.emit("newPost", newPost);
                    })
                    .catch((err) => {
                        console.log("err in userinfofrowall", err);
                    });
            })
            .catch((err) => {
                console.log("err in addPost", err);
            });
    });

    socket.on("post to movie wall", (info) => {
        db.addMovieComment(info.post, info.movieId, userId)
            .then((moviePostInfo) => {
                for (let i = 0; i < moviePostInfo.rows.length; i++) {
                    moviePostInfo.rows[i].created_at = prettierDate(
                        moviePostInfo.rows[i].created_at
                    );
                }
                db.userInfoForWall(userId)
                    .then((results) => {
                        let newMoviePost = {
                            ...moviePostInfo.rows[0],
                            ...results.rows[0],
                        };
                        console.log(
                            "new Movie post before socket emit",
                            newMoviePost
                        );
                        io.sockets.emit("newMoviePost", newMoviePost);
                    })
                    .catch((err) => {
                        console.log("err in get userInfo forMoviePost", err);
                    });
            })
            .catch((err) => {
                console.log("err in addMoviePost", err);
            });
    });

    socket.on("private chat", (chat) => {
        console.log("chat obj in private message", chat);
    });
});
