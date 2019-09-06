import axios from "axios";
import { addRoom, count, getRoom, updateRoom } from "../db";
import config from "config";

export const getOppositeDir = dir => {
  const opps = {
    n: "s",
    s: "n",
    e: "w",
    w: "e"
  };

  return opps[dir];
};

let cooling = 1;
const coolOff = () => {
  return new Promise((resolve, reject) => {
    if (cooling > 1) {
      setTimeout(() => {
        resolve(true);
      }, +cooling * 1000);
    } else {
      resolve(true);
    }
  });
};

export const examine = async itemOrPlayer => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/examine`, {
      name: itemOrPlayer
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const status = async () => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/status`)
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const take = async treasure => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/take`, {
      name: treasure
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const drop = async treasure => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/drop`, {
      name: treasure
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const sell = async item => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/sell`, {
      name: item,
      confirm: "yes"
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const pray = () => {
  //TODO do this
};

export const move = async (dir, nextRoomId) => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/move`, {
      direction: dir,
      next_room_id: nextRoomId
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const explore = async currentRoom => {
  cooling = currentRoom.cooldown;

  // if total rooms length is <500 proceed we can also change this to stop on button click instead
  const totalRooms = await count();

  // if (totalRooms < 500) {
  // find an unvisited room in currentRoom.exits, set to "exit"
  let exit;
  console.log(
    "current room",
    JSON.stringify(currentRoom, null, 1),
    currentRoom.exits
  );
  for (let ex of Object.keys(currentRoom.exits)) {
    if (currentRoom.exits[ex] === -1) {
      exit = { [ex]: currentRoom.exits[ex] };
    }
  }
  // if none exist and exists length is one, use the only exit
  if (!exit && Object.keys(currentRoom.exits).length === 1) {
    for (let ex of Object.keys(currentRoom.exits)) {
      exit = { [ex]: currentRoom.exits[ex] };
    }
  } else if (!exit) {
    // otherwise, use a random exit
    const exits = Object.keys(currentRoom.exits);
    const ex = exits[Math.floor(Math.random() * exits.length)];
    exit = { [ex]: currentRoom.exits[ex] };
  }
  console.log("now heading ", exit);
  // try to move
  let nextRoom = await move(Object.keys(exit)[0]);

  // look up room in db, if it doesn't exist add one. If it does, update exits
  // update exits: set opposite exit of exit to currentRoom and set exit of currentRoom to visitedRoom
  let visitedRoom = await getRoom(nextRoom.room_id);
  if (!visitedRoom) {
    visitedRoom = await addRoom(nextRoom);
  }

  //update visitedRoom
  visitedRoom.exits[getOppositeDir(Object.keys(exit)[0])] = currentRoom.id;
  await updateRoom(visitedRoom, visitedRoom.id);

  //update currentRoom
  currentRoom.exits[Object.keys(exit)[0]] = visitedRoom.id;
  await updateRoom(currentRoom, currentRoom.id);

  console.log("now in", visitedRoom);
  // if there are items in the room, pick it up
  if (visitedRoom.items.length) {
    for (let item of visitedRoom.items) {
      const itemTaken = await take(item);
      console.log("item taken", itemTaken);
    }
  }

  // you're in a store, sell the treasure
  if (visitedRoom.title === "Store") {
    // get current inventory
    const status = await status();
    console.log("status:", status);

    // if there is inventory, sell each item
    if (status.inventory.length) {
      for (let item of status.inventory) {
        const soldItem = await sell(item);
        console.log("item sold: ", soldItem);
      }
    }
  }

  // TODO if you're at a shrine, pray

  explore(visitedRoom);
  // }
};
