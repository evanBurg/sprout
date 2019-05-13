import React, { Component } from "react";
import { Page, Card, BackButton, Toolbar } from "react-onsenui";
import {capitalize} from '../../util'

class PlantCard extends Component {
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
  render() {
    let { plant } = this.props;
    let name = capitalize(plant.common_name);
    return (
      <Page renderToolbar={() => this.renderToolbar(name)}>
        <Card>
          <h1>{name}</h1>
          <p>{plant.id}</p>
          <p>{plant.slug}</p>
          <p>{plant.scientific_name}</p>
          <p>{plant.link}</p>
        </Card>
      </Page>
    );
  }
}

export default PlantCard;
