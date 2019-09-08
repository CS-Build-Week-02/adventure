import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import "./App.css";
import "../../node_modules/react-vis/dist/style.css"
import { ActionButtons } from "./ActionButtons";
import Map from './Map/Map'
import axios from "axios";
import config from "config";
import { init, getAllRooms } from "../db";
import { default as withActions } from "./actions";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [player, setPlayer] = useState(null)
  const [rooms, setRooms] = useState([])
  const [path, setPath] = useState([])

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(room => {
      setPath([room])
      setCurrentRoom(room);
    });

  }, []);

  useEffect(() => {
    getAllRooms().then(newRooms => {
      setRooms(newRooms)
    }).then(res => {
      setPath([...path, currentRoom])
    })
  }, [currentRoom])


  return (
    <div className="App">
      <ActionButtons
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
      />
      <Map rooms={rooms} path={path} currentRoom={currentRoom} />
    </div>
  );
}

export default withActions(App);
