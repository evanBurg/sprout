import React from "react";
import {
  Page,
  Toolbar,
  List,
  ListItem,
  ListHeader,
  Fab,
  Icon
} from "react-onsenui";
import ons from "onsenui";

class Home extends React.Component {
  state = {
    rooms: []
  };

  renderToolbar = title => {
    return (
      <Toolbar>
        <div className="center">{title}</div>
      </Toolbar>
    );
  };

  getData = async () => {
    let rooms = await window.db.rooms.toArray();
    this.setState({
      rooms
    });
  };

  componentDidMount() {
    this.getData();
  }

  createRoom = () => {
    ons.notification.prompt({
      message: "What is the name of the room?",
      callback: newRoomName => {
        let newRoom = { name: newRoomName, plants: [] };
        window.db.rooms.add(newRoom);
        this.setState({ rooms: [...this.state.rooms, newRoom] });
      }
    });
  };

  deleteRoom = async id => {
    ons.notification.confirm({
      message: "Are you sure?",
      callback: async dlt => {
        if (dlt) {
          await window.db.rooms.delete(id);
          this.getData();
        }
      }
    });
  };

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar("Home")}>
        <List
          renderHeader={() => <ListHeader>Rooms</ListHeader>}
          dataSource={this.state.rooms}
          renderRow={room => {
            return (
              <ListItem
                key={room.id}
                tappable
                onClick={() => this.deleteRoom(room.id)}
              >
                {room.name}
              </ListItem>
            );
          }}
        />

        <Fab position="bottom right" onClick={this.createRoom}>
          <Icon icon="fa-plus" size={26} style={{ verticalAlign: "middle" }} />
        </Fab>
      </Page>
    );
  }
}

export default Home;
