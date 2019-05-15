import React, { Component } from "react";
import {
  Page,
  Toolbar,
  List,
  ListItem,
  Input,
} from "react-onsenui";
import { capitalize, token, site } from "../../util";
import AddPlantPage from './AddPlantPage';

class AddPlants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: undefined,
      plants: [],
      query: ""
    };
  }

  componentDidMount = async () => {
    await this.getToken();
    this.getPlants(false, await this.getToken());
  };

  getToken = async () => {
    let { jwt } = this.state;

    let expiry;
    if(jwt)
        expiry = new Date(jwt.expiration * 1000);
    else{
        expiry = new Date();
        expiry.setDate( expiry.getDate() - 1 )
    }

    let today = new Date();
    if (expiry.getTime() < today.getTime()) {
      let jwt = await fetch(
        `https://trefle.io/api/auth/claim?token=${token}&origin=${site}`,
        { method: "POST" }
      );

      if (jwt.ok) {
        jwt = await jwt.json();

        await this.setState({
          jwt
        });
      }else{
          console.error("There was an issue fetching the JWT token...");
          console.error(await jwt.text());
      }
    }

    return jwt;
  };

  getPlants = async (query, jwt) => {
    console.log(jwt);
    let plants = [];
    if(query)
        plants = await fetch(`https://trefle.io/api/plants?q=${query}&token=${jwt.token}&page_size=${100}`)
    else
        plants = await fetch(`https://trefle.io/api/plants?token=${jwt.token}&page_size=${100}`)

    if(plants.ok){
        plants = await plants.json();

        this.setState({
            plants
        });
    }else{
        console.error("There was an issue fetching the plants...");
        console.error(await plants.text());

        this.setState({
            plants: []
        });
    }

  };

  changeQuery = async e => {
    this.setState({ query: e.target.value });

    this.getPlants(e.target.value, await this.getToken());
  };

  renderToolbar = title => {
    return (
      <Toolbar>
        <div className="center">{title}</div>
      </Toolbar>
    );
  };

  gotoPlant = (component, key, plant) => {
    let {jwt} = this.state;
    this.props.navigator.pushPage({comp: component, props: { key, plant, jwt, getToken: this.getToken, navigator: this.props.navigator }});
  }

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar("Plants")}>
        <List>
          <ListItem>
            <Input
              value={this.state.query}
              style={{ width: "100%" }}
              onChange={this.changeQuery}
              placeholder="Search plants..."
            />
          </ListItem>
        </List>

        <div
          style={{
            width: "50%",
            height: "50%",
            margin: "auto",
            textAlign: "center",
            marginTop: "6rem"
          }}
        >
          <ons-icon
            style={{ fontSize: "8em", color: "#b3b3b3" }}
            icon="ion-ios-close"
            class="ons-icon ion-ios-close ons-icon--ion"
            modifier="material"
          />
        </div>

        <List
          dataSource={[...this.state.plants]}
          renderRow={plant => {
            if (plant.common_name)
              return (
                <ListItem key={plant.id} tappable onClick={() => this.gotoPlant(AddPlantPage, `page-${plant.id}`, plant)}>
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
