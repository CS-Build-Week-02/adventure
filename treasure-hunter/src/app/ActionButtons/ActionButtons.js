import React, { Component } from "react";
import { FlexRow } from "style";
import { Button } from "@material-ui/core";
import { default as withActions } from "../actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

class ActionButtons extends Component {
  state = { open: false };

  moveAndSetCurrentRoom = dir => {
    // TODO look up room id in dictionary to see if we know the next room id and send that along if so

    this.props
      .move(dir)
      .then(room => {
        this.props.setCurrentRoom(room);
      })
      .catch(err => {});
  };

  handleTake = async () => {
    const { currentRoom } = this.props;

    if (currentRoom.items.length) {
      for (let item of currentRoom.items) {
        const itemTaken = await this.props.take(item);
        console.log("item taken: ", itemTaken);
      }
    }
  };

  handleChange = (val, prop) => {
    this.setState({ [prop]: val });
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
          onClick={() => this.props.explore(currentRoom, setCurrentRoom)}
          disabled={!currentRoom}
        >
          Explore
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ open: true })}
          disabled={!currentRoom}
        >
          Go To
        </Button>

        <Dialog
          onClose={() => this.setState({ open: false })}
          aria-labelledby="simple-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="simple-dialog-title">
            Where would you like to go?
          </DialogTitle>
          <TextField
            style={{ margin: "10px" }}
            id="destination"
            label="Destination"
            placeholder="Enter a room ID"
            onChange={e => this.handleChange(e.target.value, "destination")}
            margin="normal"
          />
          <Button
            style={{ margin: "10px" }}
            variant="contained"
            color="secondary"
            onClick={() => {
              this.props.goTo(
                currentRoom,
                this.state.destination,
                setCurrentRoom
              );
              this.setState({ open: false });
            }}
          >
            GO
          </Button>
        </Dialog>
      </FlexRow>
    );
  }
}

export default withActions(ActionButtons);
