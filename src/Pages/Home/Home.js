import React from "react";
import ferns from "./ferns.json";
import { Page, Toolbar, List, ListItem, ListHeader } from "react-onsenui";
import PlantCard from "./PlantCard"
import {capitalize} from '../../util'

class Home extends React.Component {
  state = {
    plants: []
  };

  renderToolbar = (title) => {
    return (
      <Toolbar>
        <div className="center">{title}</div>
      </Toolbar>
    );
  }

  gotoPlant = (component, key, plant) => {
    this.props.navigator.pushPage({comp: component, props: { key, plant, navigator: this.props.navigator }});
  }

  getData = async () => {
    /*
    
    ***Was trying to show a sample fetch, but their API is giving a 404 on token requests?***

    //Get client side token
    let JWT = await fetch("https://trefle.io/api/auth/claim?token=R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09&origin=localhost");
    JWT = await JWT.json();

    //Get ferns
    let res = await fetch(
      `https://trefle.io/api/plants?q=fern&token=${JWT.token}`
    );
    if (res.ok) {
        let plants = await res.json();
      this.setState({
        plants
      });
    }
    */
    this.setState({
      plants: ferns
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar('Home')}>
        <List
          renderHeader={() => <ListHeader>Ferns</ListHeader>}
          dataSource={this.state.plants}
          renderRow={plant => {
            if (plant.common_name)
              return (
                <ListItem key={plant.id} tappable onClick={() => this.gotoPlant(PlantCard, `page-${plant.id}`, plant)}>
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

export default Home;
