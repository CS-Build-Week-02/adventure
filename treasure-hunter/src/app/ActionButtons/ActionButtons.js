import React, { Component } from "react";
import { FlexRow } from "style";
import { Button } from "@material-ui/core";
import { move, explore, take } from "../actions";

class ActionButtons extends Component {
  moveAndSetCurrentRoom = dir => {
    // TODO look up room id in dictionary to see if we know the next room id and send that along if so

    move(dir)
      .then(room => {
        this.props.setCurrentRoom(room);
      })
      .catch(err => {});
  };

  handleTake = async () => {
    const { currentRoom } = this.props;

    if (currentRoom.items.length) {
      for (let item of currentRoom.items) {
        const itemTaken = await take(item);
        console.log("item taken: ", itemTaken);
      }
    }
  };

  render() {
    const { currentRoom, setCurrentRoom } = this.props;

    return (
      <FlexRow alignCenter>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("n")}
        >
          N
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("s")}
        >
          S
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("w")}
        >
          W
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("e")}
        >
          E
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleTake}
          disabled={currentRoom && !currentRoom.items.length}
        >
          Take Treasure
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => explore(currentRoom, setCurrentRoom)}
          disabled={!currentRoom}
        >
          Explore
        </Button>
      </FlexRow>
    );
  }
}

export default ActionButtons;
