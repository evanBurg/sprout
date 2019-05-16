import React, { Component } from "react";
import {
  Page,
  Toolbar,
  List,
  ListItem,
  ListHeader,
  SearchInput,
  Button,
  ProgressBar
} from "react-onsenui";
import { capitalize, getToken, development } from "../../util";
import AddPlantPage from "./AddPlantPage";

class AddPlants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: undefined,
      plants: [],
      query: "",
      loading: false
    };
  }

  componentDidMount = async () => {
    await this.refreshToken();
  };

  refreshToken = async () => {
    this.setState({ loading: true });
    let { jwt } = this.state;

    let expiry;
    if (jwt) expiry = new Date(jwt.expiration * 1000);

    let today = new Date();
    if (!jwt || expiry.getTime() < today.getTime()) {
      jwt = await getToken(development ? 'http://localhost:3000' : 'https://fernway.ca');
    }

    this.setState({ loading: false, jwt });
  };

  getPlants = async (query) => {
    let {jwt} = this.state;
    this.setState({ loading: true });
    let plants = [];
    if (query)
      plants = await fetch(
        `https://trefle.io/api/plants?q=${query}&token=${
          jwt.token
        }&page_size=${100}`
      );
    else
      plants = await fetch(
        `https://trefle.io/api/plants?token=${jwt.token}&page_size=${100}`
      );

    if (plants.ok) {
      plants = await plants.json();

      this.setState({
        plants
      });
    } else {
      console.error("There was an issue fetching the plants...");
      console.error(await plants.text());

      this.setState({
        plants: []
      });
    }
    this.setState({ loading: false });
  };

  changeQuery = async e => {
    this.setState({ query: e.target.value });
  };

  search = async () => {
    this.getPlants(this.state.query, await this.refreshToken());
  };

  renderToolbar = title => {
    return (
      <Toolbar>
        <div className="center">{title}</div>
      </Toolbar>
    );
  };

  gotoPlant = (component, key, plant) => {
    let { jwt } = this.state;
    this.props.navigator.pushPage({
      comp: AddPlantPage,
      props: {
        key,
        plant,
        jwt,
        getToken: this.refreshToken,
        navigator: this.props.navigator
      }
    });
  };

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar("Plants")}>
        {this.state.loading && <ProgressBar indeterminate />}
        <List>
          <ListItem>
            <div className="left">
              <SearchInput
                value={this.state.query}
                onChange={this.changeQuery}
              />
            </div>
            <div className="right">
              <Button onClick={this.search}>Search</Button>
            </div>
          </ListItem>
        </List>
        <List
          style={{ maxHeight: "-webkit-fill-available", overflowY: "auto" }}
          renderHeader={() => <ListHeader>Results</ListHeader>}
          dataSource={this.state.plants}
          renderRow={plant => {
            if (plant.common_name)
              return (
                <ListItem
                  key={plant.id}
                  tappable
                  onClick={() => this.gotoPlant(null, plant.id, plant)}
                >
                  {capitalize(plant.common_name)}
                </ListItem>
              );
            else return <React.Fragment key={plant.id} />;
          }}
        />
      </Page>
    );
  }
}

export default AddPlants;
