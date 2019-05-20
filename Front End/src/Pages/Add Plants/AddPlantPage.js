import React, { Component } from "react";
import {
  Page,
  Card,
  BackButton,
  Toolbar,
  ProgressBar,
  Button,
  Icon,
  Ripple,
} from "react-onsenui";
import "./AddPlantPage.css";
import { capitalize } from "../../util";
import Select from "react-select/dist/react-select";

class AddPlantPage extends Component {
  state = {
    details: {},
    rooms: [],
    loading: true,
    error: false,
    specsShown: false,
    selectedRoom: '',
    adding: false
  };

  componentDidMount = async () => {
    let { plant } = this.props;
    let rooms = await window.db.rooms.toArray();
    let res = await fetch(
      `https://fernway-api.herokuapp.com/plant/${plant.id}`
    );
    if (res.ok) {
      let details = await res.json();
      console.log(details);
      this.setState({
        details,
        rooms: rooms.map(room => {
          return { label: room.name, value: room.id };
        }),
        loading: false
      });
    } else {
      this.setState({
        error: true
      });
    }
  };

  renderToolbar = title => {
    return (
      <Toolbar>
        <div className="left">
          <BackButton>Back</BackButton>
        </div>
        <div className="center">{title}</div>
      </Toolbar>
    );
  };

  renderSpecifications = specs => {
    const objectKeys = { mature_height: "ft", max_height_at_base_age: "ft" };

    let elements = [];
    for (let spec in specs) {
      if (specs.hasOwnProperty(spec)) {
        let text = specs[spec];

        if (objectKeys.hasOwnProperty(spec))
          text = specs[spec][objectKeys[spec]];

        if (spec)
          elements.push(
            <p key={`key-${spec}`}>
              <strong>{capitalize(spec.replaceAll("_", " "))}</strong>:{" "}
              {text || "No data"}
            </p>
          );
        else elements.push(<React.Fragment />);
      }
    }
    return elements;
  };

  renderImage = details => {
    let { plant } = this.props;

    if (details.images && details.images.length > 0) {
      return (
        <img
          style={{ width: "100%" }}
          src={details.images[0].url}
          alt={capitalize(plant.common_name)}
        />
      );
    } else {
      return (
        <img
          style={{ width: "100%" }}
          src="https://smithssanitationsupply.ca/wp-content/uploads/2018/06/noimage-1.png"
          alt={capitalize(plant.common_name)}
        />
      );
    }
  };

  toggleSpecs = () => {
    this.setState({
      specsShown: !this.state.specsShown
    });
  };

  addToRoom = async () => {
    this.setState({
      adding: true
    })

    let {selectedRoom} = this.state;
    let room = await window.db.rooms.get(selectedRoom.value);
    room.plants.push(this.props.plant);
    await window.db.rooms.where({id: selectedRoom.value}).modify(room);

    this.props.navigator.popPage();
    this.setState({
      adding: false
    })
  }

  render() {
    let { plant } = this.props;
    let { loading, details } = this.state;
    let name = capitalize(plant.common_name);

    if (!loading) {
      return (
        <Page renderToolbar={() => this.renderToolbar(name)}>
         {this.state.adding && <ProgressBar indeterminate />}
          <Card>
            <h1>{name}</h1>
            {this.renderImage(details)}
            {details.duration && <p>{capitalize(details.duration)}</p>}
            <p>{plant.scientific_name || ""}</p>
            {details && details.family && <p>{details.family.name}</p>}

            <div className="specs-expand" onClick={this.toggleSpecs}>
              <Ripple />
              <p>
                <strong>Specifications</strong>
              </p>
              <Icon
                style={{
                  transition: "all 0.5s",
                  transform: this.state.specsShown ? "unset" : "rotate(180deg)"
                }}
                size={{ default: 20 }}
                icon={{ default: "chevron-down" }}
              />
            </div>
            <div
              className={`specs-details ${
                this.state.specsShown ? "open" : "closed"
              }`}
            >
              {this.renderSpecifications(details.main_species.specifications)}
            </div>
            <hr />
            <Select
              value={this.state.selectedRoom}
              onChange={(room) => this.setState({selectedRoom: room})}
              options={this.state.rooms}
            />
            <Button onClick={this.addToRoom} style={{ marginTop: 7 }} modifier="large--cta">Add to Room</Button>
          </Card>
        </Page>
      );
    } else {
      return (
        <Page>
          <ProgressBar indeterminate />
        </Page>
      );
    }
  }
}

export default AddPlantPage;
