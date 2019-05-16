import React, { Component } from "react";
import { Page, Card, BackButton, Toolbar, ProgressBar, Button } from "react-onsenui";
import { capitalize } from "../../util";

class AddPlantPage extends Component {
  state = {
    details: {},
    loading: true,
    error: false
  };

  componentDidMount = async () => {
    let { plant } = this.props;

    let res = await fetch(
      `https://fernway-api.herokuapp.com/plant/${plant.id}`
    );
    if (res.ok) {
      let details = await res.json();
      console.log(details)
      this.setState({
        details,
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
  render() {
    let { plant } = this.props;
    let { loading, details } = this.state;
    let name = capitalize(plant.common_name);

    if (!loading) {
      return (
        <Page renderToolbar={() => this.renderToolbar(name)}>
          <Card>
            <h1>{name}</h1>
            {details.duration && <p>{capitalize(details.duration)}</p>}
            <p>{plant.scientific_name}</p>
            <p>{details.family.name}</p>
            <Button>Add to Home</Button>
          </Card>
        </Page>
      );
    } else {
      return (
        <Page>
          <ProgressBar indeterminate />
        </Page>
      )
    }
  }
}

export default AddPlantPage;