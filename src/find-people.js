import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("");

    useEffect(() => {
        let abort;
        console.log("useffect in findpeople userS");
        axios.get("/api/users/").then(({ data }) => {
            console.log("data  in findpeople", data);
            if (!abort) {
                setUsers(data);
            }
        });
        return () => {
            abort = true;
        };
    }, []);

    useEffect(() => {
        let abort;
        console.log("useffect in findpeople user");
        console.log("user in user", user);
        axios.get(`/api/users/${user}`).then(({ data }) => {
            console.log("data  in findpeople", data);
            if (!abort) {
                setUsers(data);
            }
        });
        return () => {
            abort = true;
        };
    }, [user]);

    return (
        <div id="find-people">
            <div>
                <p>Looking for someone in particular?</p>
                <input onChange={(e) => setUser(e.target.value)} />
            </div>
            {user == "" && <p>Recently joined</p>}
            <div id="recently-joined">
                {users.map((eachUser) => (
                    <div key={eachUser.id} id="profile-containers">
                        <Link to={"/user/" + eachUser.id}>
                            {eachUser.profile_pic && (
                                <img
                                    src={eachUser.profile_pic}
                                    onError={(e) =>
                                        (e.target.src = "/default.jpg")
                                    }
                                />
                            )}
                            {eachUser.profile_pic == null && (
                                <img src="./default.jpg" />
                            )}
                            <div className="noDeco">
                                {eachUser.first} {eachUser.last}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
