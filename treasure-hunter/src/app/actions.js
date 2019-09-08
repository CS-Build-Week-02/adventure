import React, { Component } from "react";
import axios from "axios";
import { addRoom, count, getRoom, updateRoom } from "../db";
import config from "config";

export default WrappedComponent => {
  return class extends Component {
    constructor() {
      super();

      this.state = {
        exploring: false,
        currentRoom: null
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
          this.cooling = data.cooldown ? +data.cooldown : 15;
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
          this.cooling = data.cooldown ? +data.cooldown : 15;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    take = async treasure => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/take`, {
          name: treasure
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 15;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };
    drop = async treasure => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/drop`, {
          name: treasure
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 15;
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
          this.cooling = data.cooldown ? +data.cooldown : 15;
          return data;
        })
        .catch(err => {
          throw err;
        });
    };

    pray = () => {
      //TODO do this
    };

    move = async (dir, nextRoomId) => {
      await this.coolOff();

      return axios
        .post(`${config.API_PATH}/move`, {
          direction: dir,
          next_room_id: nextRoomId
        })
        .then(({ data }) => {
          this.cooling = data.cooldown ? +data.cooldown : 15;
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
      }

      breadcrumbs.push(startingRoom);
      localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));

      console.log("breadcrumbs length: ", breadcrumbs.length);

      console.log(
        "starting room",
        JSON.stringify(startingRoom, null, 1)
      );

      this.cooling = startingRoom.cooldown;

      while (breadcrumbs.length) {
        // remove from stack, this is our current room
        const r = breadcrumbs[breadcrumbs.length - 1];
        await this.setState({ currentRoom: r });

        // if there are items in the room, pick it up
        if (r.items.length) {
          for (let item of r.items) {
            const itemTaken = await this.take(item);
            console.log("item taken", itemTaken);
          }
        }

        // you're in a store, sell the treasure
        if (r.title === "Store") {
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
            console.log("now heading ", exit);
            // try to move
            let nextRoom = await this.move(Object.keys(exit)[0])
            await setRoom(nextRoom)
            

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

            console.log("now in", visitedRoom.room_id, visitedRoom.coordinates);




            break;
          }
        }

        if (!unvisitedRooms && breadcrumbs.length) {
          // otherwise, if they're all visited go back
          breadcrumbs.pop();
          localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
          const goBackTo = breadcrumbs[breadcrumbs.length - 1],
            ids = Object.values(goBackTo.exits),
            ind = ids.indexOf(r.id),
            dir = this.getOppositeDir(Object.keys(goBackTo.exits)[ind]);
          console.log("back tracking to: ", dir);
          await this.move(dir).then(room => {
            setRoom(room)
          })
        }
      }
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
