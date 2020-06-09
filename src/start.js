import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket"; //giving socket.js file access to redux
// =======================  redux stuff =============================
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
// ================================================================
// const socket = io.connect();

// socket.on("welcome", function (data) {
//     console.log(data);
//     socket.emit("thanks", {
//         message: "Thank you. It is great to be here.",
//     });
// });

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

console.log("startpage");
if (userIsLoggedIn) {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));

// import axios from "./axios"
// import {useStatefulFields, useAuthSubmit} from "./hooks"

// ReactDOM.render(
//     <>
//     <Login/>
//     <Register/>
//     </>
// )
