import Dexie from "dexie";
import axios from "axios";
import config from "config";
import contourSeries from "react-vis/dist/plot/series/contour-series";

let db;

export const init = () => {
  
  db = new Dexie("TreasureHuntDB");
  db.version(1).stores({
    rooms: "&id",
    path: "++id"
  });

  let url = `${config.API_PATH}/init`;

  return axios
    .get(url)
    .then(({ data }) => {
      return db.rooms.get(data.room_id).then(initialRoom => {

        if (!initialRoom) {
          return addRoom(data);
        } else {
          return getRoom(data.room_id);
        }
      });
    })
    .then(room => {
      return (
      db.path
      .toArray()
      .then(coors => {
        if (!coors.length) {
          return addPath(room)
          .then(id => {
            return getPath()
            .then(path => {
              return {room: room, path: path}
            })
          })
        }
        else {
          return getPath()
          .then(path => {
            return {room: room, path: path}
          }
          )
        }
      })
      )
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
  return db.rooms.toArray().then(rooms => rooms).catch(err => console.log(err))
      
}

export const getPath = () => {
  return db.path.toArray().then(path => path).catch(err => console.log(err))
}

export const getLatestPath = id => {
  return db.path.get(id).then(coor => coor).catch(err => console.log(err))
}

export const addRoom = async room => {
  /**
   * adds a room to the map
   */
  let check = await getRoom(room.room_id)
  if (check) {
    room.id = room.room_id;
    return updateRoom(room)
    .then(room => {
      return room
    })
    .catch(err => {
      console.log(err)
    })
  }
else {
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
}
  
};

export const addPath = (dir, room) => {
  let str = room.coordinates.replace("(", "").replace(")", "").replace(",", "").split('')
  let coors = { x: parseInt(`${str[0]}${str[1]}`), y: parseInt(`${str[2]}${str[3]}`), room_id: room.room_id, direction: dir }

  return db
  .table("path")
  .add(coors)
  .then(id => {
    return getLatestPath(id)
  })
  .then(coor => coor)
  .catch(err => console.log(err))
}

export const updateRoom = room => {
  /**
   * updates a room in the map
   */

  // initialize the list with an empty array for this node
  return db
    .table("rooms")
    .put(room)
    .then(id => {
      return getRoom(id)
    })
    .catch(err => console.log(err))
};
