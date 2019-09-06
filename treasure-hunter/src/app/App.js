import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import "./App.css";
import { ActionButtons } from "./ActionButtons";
import Map from './Map/Map'
import axios from "axios";
import config from "config";
import { init, getAllRooms } from "../db";
import { status } from "./actions";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [player, setPlayer] = useState(null)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(room => {
      setCurrentRoom(room);
    });

  }, []);

  useEffect(() => {
    getAllRooms().then(newRooms => {
      setRooms(newRooms)
    }).then(res => console.log(rooms))
  }, [currentRoom])


  // componentDidMount() {
  //   axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

  //   init().then(room => {
  //     this.setCurrentRoom(room);
  //   });

  //   // TODO uncomment this when status has been completed in ./actions.js
  //   /*status().then(player => {
  //     this.setState({ player });
  //   });*/
  // }

  // setCurrentRoom = currentRoom => {
  //   this.setState({ currentRoom });
  // };


  return (
    <div className="App">
      <ActionButtons
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
      />
      <Map rooms={rooms} />
    </div>
  );
}

export default App;
