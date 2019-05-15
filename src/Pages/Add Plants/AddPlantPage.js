import React, { Component } from "react";
import { Page, Card, BackButton, Toolbar, ProgressBar } from "react-onsenui";
import { capitalize } from "../../util";

class AddPlantPage extends Component {
  state = {
    details: {},
    loading: true,
    error: false
  };

  componentDidMount = async () => {
    let { jwt, getToken } = this.props;

    await getToken();

    let res = await fetch(
      `https://trefle.io/api/plants?q=fern&token=${jwt.token}`
    );
    if (res.ok) {
      let details = await res.json();
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
    let { details, loading } = this.state;
    let name = capitalize(plant.common_name);

    if (!loading) {
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
