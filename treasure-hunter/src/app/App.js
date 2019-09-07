import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { ActionButtons } from "./ActionButtons";
import axios from "axios";
import config from "config";
import { init } from "../db";
import { default as withActions } from "./actions";

class App extends Component {
  state = {
    currentRoom: null,
    player: null
  };

  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(room => {
      this.setCurrentRoom(room);
    });

    // TODO uncomment this when status has been completed in ./actions.js
    /*this.props.status().then(player => {
      this.setState({ player });
    });*/
  }

  setCurrentRoom = currentRoom => {
    this.setState({ currentRoom });
  };

  render() {
    const { currentRoom } = this.state;

    return (
      <div className="App">
        <ActionButtons
          currentRoom={currentRoom}
          setCurrentRoom={this.setCurrentRoom}
        />
      </div>
    );
  }
}

export default withActions(App);
