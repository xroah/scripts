import React from "react";
import { hot } from "react-hot-loader/root";
import logo from "../public/logo.svg";
import "./app.css";

class App extends React.Component {
    state = {};

    render() {
        return (
            <div className="app">
                <div className="content">
                    <img src={logo} className="logo" alt="logo" />
                    <p>Hello React!</p>
                    <a
                        className="learn-link"
                        href="https://reactjs.org"
                        target="_blank">
                        Learn React
                    </a>
                </div>
            </div>
        )
    }

}

export default hot(App);