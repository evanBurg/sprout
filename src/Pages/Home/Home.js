import React from "react";
import {
  Page,
  Toolbar,
  List,
  ListItem,
  ListHeader,
  Fab,
  Icon,
} from "react-onsenui";
import ons from 'onsenui';

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

  gotoPlant = (component, key, plant) => {
    this.props.navigator.pushPage({
      comp: component,
      props: { key, plant, navigator: this.props.navigator }
    });
  };

  getData = async () => {
    let rooms = await window.db.rooms.toArray();
    console.log(rooms)
    this.setState({
      rooms
    });
  };

  componentDidMount() {
    this.getData();
  }

  createRoom = () => {
    ons.notification.prompt({
      message: 'What is the name of the room?',
      callback: (newRoomName) => {
        let newRoom = { name: newRoomName, plants: [] };
        window.db.rooms.add(newRoom);
        this.setState({ rooms: [...this.state.rooms, newRoom] });
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
                >
                  {room.name}
                </ListItem>
              )
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
