import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import "./App.css";
import "../../node_modules/react-vis/dist/style.css"
import { ActionButtons } from "./ActionButtons";
import Map from './Map/Map'
import axios from "axios";
import config from "config";
import { init, getAllRooms, getPath } from "../db";
import { default as withActions } from "./actions";
import {Room} from "../app/room/room";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [player, setPlayer] = useState(null)
  const [rooms, setRooms] = useState([])
  const [path, setPath] = useState([])

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(res => {
      console.log(res)
      setPath([...res.path])
      setCurrentRoom(res.room);
    });

  }, []);

  useEffect(() => {
    getAllRooms()
    .then(newRooms => {
      return setRooms(newRooms)
    })
    .then(rooms => {
      return getPath()
    })
    .then(path => setPath(path))
    .catch(err => console.log(err))
  }, [currentRoom])


  return (
    <div className="App">
      <ActionButtons
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
      />
      <Map rooms={rooms} path={path} currentRoom={currentRoom} />
      <Room currentRoom={currentRoom}></Room>
    </div>
  );
}

export default withActions(App);
