import Dexie from "dexie";
import axios from "axios";
import config from "config";

let db;

export const init = () => {
  db = new Dexie("TreasureHuntDB");
  db.version(1).stores({
    rooms: "&id"
  });

  let url = `${config.API_PATH}/init`;

  return axios
    .get(url)
    .then(({ data }) => {
      return db.rooms.get(data.room_id).then(initialRoom => {
        console.log("initial room: ", initialRoom);

        if (!initialRoom) {
          return addRoom(data);
        } else {
          return getRoom(data.room_id);
        }
      });
    })
    .catch(err => {
      throw err;
    });
};

export const count = () => {
  return db.rooms.count();
};

export const getRoom = id => {
  return db.rooms.get(id).then(room => {
    return room;
  })
    .catch(err => {
      throw err;
    });
};

export const getAllRooms = () => {
  return db.rooms.toArray().then(rooms => rooms)
      
}

export const addRoom = room => {
  /**
   * adds a room to the map
   */
  room.id = room.room_id;
  let exits = {};
  for (let r of room.exits) {
    exits[r] = -1;
  }
  room.exits = exits;

  // initialize the list with an empty array for this node
  return db
    .table("rooms")
    .add(room)
    .then(id => {
      return db.rooms
        .get(room.room_id)
        .then(initialRoom => {
          return initialRoom;
        })
        .catch(err => {
          console.log(err);
        });
    });
};

export const updateRoom = room => {
  /**
   * updates a room in the map
   */

  // initialize the list with an empty array for this node
  return db
    .table("rooms")
    .put(room)
    .then(() => {
      return room;
    });
};
