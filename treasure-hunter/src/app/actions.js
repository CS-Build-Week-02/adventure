import React, { Component } from "react";
import axios from "axios";
import {
  addRoom,
  count,
  getRoom,
  getAllRooms,
  updateRoom,
  getPath,
  getLatestPath,
  addPath
} from "../db";
import config from "config";

export default WrappedComponent => {
  return class extends Component {
    constructor() {
      super();

      this.state = {
        exploring: false,
        currentRoom: null,
        dropped: false
      };
      this.cooling = 1;
    }

    coolOff = () => {
      return new Promise((resolve, reject) => {
        if (this.cooling > 1) {
          setTimeout(() => {
            resolve(true);
          }, +this.cooling * 1000);
        } else {
          resolve(true);
        }
      });
    };

    getOppositeDir = dir => {
      const opps = {
        n: "s",
        s: "n",
        e: "w",
        w: "e"
      };

      return opps[dir];
    };

    examine = async itemOrPlayer => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/examine`, {
          name: itemOrPlayer
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 10;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    status = async () => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/status`)
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 10;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    take = async treasure => {
      await this.coolOff();
      let status = await this.status();

      if (status.encumbrance > status.strength - 1) {
        let inventory = status.inventory;
        let diff = status.encumbrance - status.strength;
        console.log(inventory);
        console.log({
          encumbrance: status.encumbrance,
          strength: status.strength,
          diff: diff
        });
        let dropList = [];

        return this.drop(inventory[inventory.length - 1]);
      } else {
        return axios
          .post(`${config.API_PATH}/take`, {
            name: treasure
          })
          .then(({ data }) => {
            this.cooling = data.cooldown ? +data.cooldown : 10;
            return data;
          })
          .catch(err => {
            throw err;
          });
      }
    };
    drop = async treasure => {
      await this.coolOff();
      console.log("dropping treasure... Please be patient...");

      return axios
        .post(`${config.API_PATH}/drop`, {
          name: treasure
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 10;
          this.setState({ ...this.state, dropped: true });
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    sell = async item => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/sell`, {
          name: item,
          confirm: "yes"
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 10;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    change_name = async name => {
      await this.coolOff();

      return axios
      .post(`${config.API_PATH}/change_name`, {
        name: "Angelon", 
        confirm: "aye"
      })
      .then(({data}) => {
        this.cooling = data.cooldown ? +data.cooldown : 10
        return data
      })
      .catch(err => {
        throw err
      })
    }


    pray = () => {
      //TODO do this
    };

    move = async (dir, setRoom, nextRoomId) => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/move`, {
          direction: dir,
          next_room_id: nextRoomId
        })
        .then(async ({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 10;
          await addPath(dir, data);
          await setRoom(data);
          this.setState({ ...this.state, dropped: false });
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    explore = async (startingRoom, setRoom, addNewRoom) => {
      this.setState({ exploring: true });
      let breadcrumbs = localStorage.getItem("breadcrumbs");
      if (breadcrumbs) {
        breadcrumbs = JSON.parse(breadcrumbs);
      } else {
        breadcrumbs = [];
        breadcrumbs.push(startingRoom);
        localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
      }

      console.log("breadcrumbs length: ", breadcrumbs.length);

      console.log("starting room", JSON.stringify(startingRoom, null, 1));

      this.cooling = startingRoom.cooldown;

      while (breadcrumbs.length) {
        // remove from stack, this is our current room
        const r = breadcrumbs[breadcrumbs.length - 1];
        await this.setState({ currentRoom: r });

        // if there are items in the room, pick it up
        if (r.items.length && !this.state.dropped) {
          for (let item of r.items) {
            const itemTaken = await this.take(item);
            console.log("item taken", itemTaken);
          }
        }

        if (r.room_id === 467) {
          const status = await this.status();
          if (status.gold >= 1000) {
            await this.change_name("Kyle");
            let status = await this.status();
            console.log("STATUS: ", status);
          } else {
            console.log(
              "You're in Pirate Ry's but you don't have enough gold to change your name.",
              JSON.stringify(status, null, 1)
            );
          }
        }

        // you're in a store, sell the treasure
        if (r.room_id === 1) {
          // get current inventory
          const status = await this.status();
          console.log("status:", status);

          // if there is inventory, sell each item
          if (status.inventory.length) {
            for (let item of status.inventory) {
              const soldItem = await this.sell(item);
              console.log("item sold: ", soldItem);
            }
          }
        }

        // TODO if you're at a shrine, pray

        let unvisitedRooms = false;
        for (let ex of Object.keys(r.exits)) {
          // if it is unvisited go that way
          if (r.exits[ex] === -1) {
            unvisitedRooms = true;
            const exit = { [ex]: r.exits[ex] };
            // this.setState({...this.state, unvisited: exit})
            console.log("now heading ", exit);
            // try to move
            let nextRoom = await this.move(Object.keys(exit)[0], setRoom);

            // add and set our next room, visitedRoom

            let visitedRoom = await addRoom(nextRoom);

            // add previous room to stack so we know where to backtrack to
            breadcrumbs.push(visitedRoom);
            localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));

            // update visitedRoom exit with previous room id
            visitedRoom.exits[this.getOppositeDir(Object.keys(exit)[0])] = r.id;
            await updateRoom(visitedRoom, visitedRoom.id);

            // update previous room exist with visitedRoom id, this is same as marking it visited
            r.exits[Object.keys(exit)[0]] = visitedRoom.id;
            await updateRoom(r, r.id);
            await setRoom(visitedRoom);
            let status = await this.status();

            console.log(
              "now in: ",
              visitedRoom.room_id,
              visitedRoom.coordinates,
              "current status: ",
              JSON.stringify(status, null, 1)
            );

            break;
          }
        }

        if (!unvisitedRooms && breadcrumbs.length) {
          // otherwise, if they're all visited go back
          if (breadcrumbs.length > 1) {
            breadcrumbs.pop();
            localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
            const goBackTo = breadcrumbs[breadcrumbs.length - 1],
              ids = Object.values(goBackTo.exits),
              ind = ids.indexOf(r.id),
              dir = this.getOppositeDir(Object.keys(goBackTo.exits)[ind]);
            console.log("back tracking to: ", dir);
            await this.move(dir, setRoom);
          } else {
            const goBackTo = breadcrumbs[breadcrumbs.length - 1];
            let ids = Object.values(goBackTo.exits);
            let unvisited = ids.filter(id => id === "?");

            if (unvisited.length) {
              console.log("Starting from the beginning: ", goBackTo);
              this.explore(goBackTo, setRoom);
            } else {
              let graph = await getAllRooms();
              if (graph.length === 500) {
                console.log("Congratulations! You've explored the whole map!");
                return graph;
              } else {
                console.log(
                  "Uh oh! Something went wrong. You're out of rooms to visit, but you don't have a full map."
                );
                return graph;
              }
            }
          }
        }
      }
    };

    findPath = async (startingRoom, destination) => {
      console.log("Finding path...");
      return new Promise(async resolve => {
        let path = [],
          visited = {};

        path.push(startingRoom);
        visited[startingRoom.id] = true;

        while (path.length) {
          let r = path[path.length - 1],
            badPath = true;

          if (r.id === destination) {
            return resolve(path);
          }

          for (let dir of Object.keys(r.exits)) {
            if (r.exits[dir] > -1 && !visited[r.exits[dir]]) {
              badPath = false;
              let adj = await getRoom(r.exits[dir]);
              path.push(adj);
              visited[adj.id] = true;
              break;
            }
          }

          if (badPath) {
            path.pop();
          }
        }

        if (!path.length) {
          resolve(null);
        }
      });
    };

    followPath = path => {
      return new Promise(async resolve => {
        // iterate each room in the path
        let room;
        for (let ind in path) {
          room = path[+ind];
          const nextRoom = path[+ind + 1];

          if (room && nextRoom) {
            // find the room id of the exit to the next room
            let exit;
            for (let ex of Object.keys(room.exits)) {
              if (room.exits[ex] === nextRoom.id) {
                exit = room.exits[ex];
              }
            }

            // move to that room id
            await this.move(exit);
          }
        }
        // return the end room
        resolve(room);
      });
    };

    render() {
      return (
        <WrappedComponent
          explore={this.explore}
          move={this.move}
          status={this.status}
          take={this.take}
          {...this.state}
          {...this.props}
        />
      );
    }
  };
};
