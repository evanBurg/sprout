import React from "react";
import {
  Page,
  Toolbar,
  List,
  ListItem,
  ListHeader,
  Fab,
  Button,
  Icon,
  PullHook
} from "react-onsenui";
import ons from "onsenui";
import { capitalize } from "../../util";
class Home extends React.Component {
  state = {
    rooms: [],
    loading: true,
    pullHookState: 'initial'
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
    console.log(rooms);
    this.setState({
      rooms,
      loading: false,
      pullHookState: 'initial'
    });
  };

  componentDidMount() {
    this.getData();
  }

  createRoom = () => {
    ons.notification.prompt({
      message: "What is the name of the room?",
      callback: newRoomName => {
        this.setState({
          loading: true
        });
        let newRoom = { name: newRoomName, plants: [] };
        window.db.rooms.add(newRoom);
        this.setState({
          rooms: [...this.state.rooms, newRoom],
          loading: false
        });
      }
    });
  };

  deleteRoom = async id => {
    ons.notification.confirm({
      message: "Are you sure?",
      callback: async dlt => {
        if (dlt) {
          this.setState({
            loading: false
          });
          await window.db.rooms.delete(id);
          this.getData();
        }
      }
    });
  };

  pullChange = event => {
    this.setState({
      pullHookState: event.state
    })
  }

  handleLoad = async (done) => {
    let rooms = await window.db.rooms.toArray();
    console.log(rooms);
    this.setState({
      rooms,
      loading: false,
      pullHookState: 'initial'
    }, done);
  }

  render() {
    const state = this.state.pullHookState;
    let content = '';
    if (state === 'initial') {
      content = 'Pull to Refresh';
    }
    else if (state === 'preaction') {
      content = 'Release to Refresh';
    }
    else {
      content = <span><Icon size={35} spin={true} icon='ion-load-d'></Icon> Loading data...</span>;
    }

    return (
      <Page renderToolbar={() => this.renderToolbar("Home")}>
        <PullHook onChange={this.pullChange} onLoad={this.handleLoad}>
        {content}
        </PullHook>
        <List
          renderHeader={() => <ListHeader>Rooms</ListHeader>}
          dataSource={this.state.rooms}
          renderRow={room => {
            return (
              <ListItem
                key={room.id}
                style={{ justifyContent: "space-between" }}
                tappable
                expandable
              >
                <div className="left">{room.name}</div>
                <div className="right">
                  <Button
                    style={{ backgroundColor: "#F44336" }}
                    onClick={() => this.deleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="expandable-content">
                  {room.plants.length > 0 ? (
                    room.plants.map(plant => (
                      <p>{capitalize(plant.common_name)}</p>
                    ))
                  ) : (
                    <p>No plants in this room.</p>
                  )}
                </div>
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
