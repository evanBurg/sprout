import React from "react";
import {
  Page,
  Toolbar,
  List,
  ListHeader,
  Fab,
  Ripple,
  Icon,
  PullHook,
  Row,
  Col
} from "react-onsenui";
import ons from "onsenui";
import IconButton from "./IconButton";
import {Context} from "../../App";

import { capitalize, development } from "../../util";
class Home extends React.Component {
  state = {
    loading: true,
    pullHookState: "initial"
  };

  renderToolbar = title => {
    return (
      <Toolbar>
        <div className="center">{title}</div>
      </Toolbar>
    );
  };

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
    });
  };

  handleLoad = async (done, context) => {
    await context.refresh();
    this.setState(
      {
        pullHookState: "initial"
      },
      done
    );
  };

  getRandomImage = () => {
    let imgNum = Math.floor(Math.random() * Math.floor(16)) + 1;
    let imgSrc = development
      ? `/img/plants/${imgNum}.png`
      : `/sprout/img/plants/${imgNum}.png`;
    return imgSrc;
  };

  generatePlantList = room => {
    let rows = [];
    let plants = room.plants;

    let i = 0;
    plants.forEach(plant => {
      if (!rows[i]) rows[i] = [];

      rows[i].push(plant);

      //Want 3 plants per row
      if (rows[i].length === 3) i++;
    });

    return rows.map((plants, index) => (
      <Row
        key={"plant-row-index-" + index + "-" + room.name}
        verticalAlign="center"
        style={{ justifyContent: "space-evenly", alignItems: "center" }}
      >
        {plants.map((plant, index) => (
          <Col
            key={"plant-col-index-" + index + "-" + room.name}
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              textAlign: "center",
              padding: 5
            }}
          >
            <img src={this.getRandomImage()} style={{ width: 80 }} alt={plant.common_name} />
            <p>{capitalize(plant.common_name)}</p>
          </Col>
        ))}
      </Row>
    ));
  };

  renderFab = () => {
    return (
      <Fab position="bottom right" onClick={this.createRoom}>
        <Icon icon="fa-plus" size={26} style={{ verticalAlign: "middle" }} />
      </Fab>
    );
  };

  render() {
    const state = this.state.pullHookState;
    let content = "";
    if (state === "initial") {
      content = "Pull to Refresh";
    } else if (state === "preaction") {
      content = "Release to Refresh";
    } else {
      content = (
        <span>
          <Icon size={35} spin={true} icon="ion-load-d" /> Loading data...
        </span>
      );
    }

    return (
      <Context.Consumer>
        {context =>
          <Page renderToolbar={() => this.renderToolbar("Home")} renderFixed={this.renderFab}>
          <PullHook onChange={this.pullChange} onLoad={done => this.handleLoad(done, context)}>
            {content}
          </PullHook>
          <h1 style={{ textAlign: "center" }}>Home Name</h1>
          <Row
            verticalAlign="center"
            style={{ justifyContent: "space-evenly", alignItems: "center" }}
          >
            <Col
              style={{
                justifyContent: "space-evenly",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <IconButton
                icon="md-plus-circle"
                text="Add Plant"
                color="#4CAF50"
              />
            </Col>
            <Col
              style={{
                justifyContent: "space-evenly",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <IconButton icon="md-refresh" text="Reset" color="#F44336" />
            </Col>
            <Col
              style={{
                justifyContent: "space-evenly",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <IconButton icon="md-settings" text="Settings" color="#424242" />
            </Col>
          </Row>
          <List
            renderHeader={() => <ListHeader>Rooms</ListHeader>}
            dataSource={context.rooms}
            renderRow={room => {
              return (
                <React.Fragment key={room.id}>
                  <Row>
                    <Col>
                      <h3 style={{ textAlign: "center" }} onClick={() => this.deleteRoom(room.id)}>
                      {room.name || "error"}
                      <Ripple/>
                      </h3>
                      <p
                        style={{
                          textAlign: "center",
                          color: "#acacac",
                          marginTop: -12,
                          fontSize: 14
                        }}
                      >
                        {room.plants.length} plant
                        {room.plants.length === 1 ? "" : "s"}
                      </p>
                    </Col>
                  </Row>
                  {this.generatePlantList(room)}
                </React.Fragment>
              );
            }}
          />
        </Page>
        }
      </Context.Consumer>
    );
  }
}

export default Home;
