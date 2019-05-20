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
import { capitalize, getToken, development, removeDuplicates } from "../../util";
import AddPlantPage from "./AddPlantPage";

class AddPlants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: undefined,
      plants: [],
      query: "",
      loading: false,
      page: 0,
      pageSize: 100
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

  getPlants = async (setState = true) => {
    let {jwt, page, pageSize, query} = this.state;
    this.setState({ loading: true });
    let plants = [];
    if (query)
      plants = await fetch(
        `https://trefle.io/api/plants?q=${query}&token=${
          jwt.token
        }&page_size=${pageSize}&page=${page}`
      );
    else
      plants = await fetch(
        `https://trefle.io/api/plants?token=${jwt.token}&page_size=${pageSize}&page=${page}`
      );

    if (plants.ok && setState) {
      plants = await plants.json();

      this.setState({
        plants: removeDuplicates(plants, 'common_name'),
        loading: false
      });
    } else if (plants.ok && !setState) {
      this.setState({ loading: false });
      plants = await plants.json();
      return removeDuplicates(plants, 'common_name');
    } else {
      console.error("There was an issue fetching the plants...");
      console.error(await plants.text());

      this.setState({
        plants: [],
        loading: false
      });
    }
  };

  changeQuery = async e => {
    this.setState({ query: e.target.value });
  };

  search = async () => {
    await this.refreshToken()
    this.getPlants();
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
        rooms: this.props.rooms,
        getToken: this.refreshToken,
        navigator: this.props.navigator
      }
    });
  };

  handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      this.setState({
        page: this.state.page+1
      }, async () => {
        await this.refreshToken()
        let nextPage = await this.getPlants(false);
        let plants = [...this.state.plants, ...nextPage];
        this.setState({
          plants 
        })
      });
    }
  }

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar("Plants")}>
        {this.state.loading && <ProgressBar indeterminate />}
        <List>
          <ListItem>
            <div className="left">
              <SearchInput
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    this.search();
                  }
                }}
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
          onScroll={this.handleScroll}
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
