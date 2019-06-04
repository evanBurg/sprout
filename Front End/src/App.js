import React from "react";

import { Page, Tabbar, Tab, Navigator } from "react-onsenui";

import Home from "./Pages/Home/Home";
import AddPlants from "./Pages/Add Plants/AddPlants";

const AppContext = React.createContext();

class Tabs extends React.Component {
  renderTabs = () => {
    return [
      {
        content: <Home key="home" navigator={this.props.navigator} />,
        tab: <Tab key="home" label="Home" icon="ion-ios-home" />
      },
      {
        content: <AddPlants key="plants" navigator={this.props.navigator} />,
        tab: <Tab key="plants" label="Plants" icon="ion-leaf" />
      }
    ];
  };

  render() {
    return (
      <Page>
        <Tabbar swipeable renderTabs={this.renderTabs} />
      </Page>
    );
  }
}

class App extends React.Component {
  state = {
    rooms: [],
    loading: false
  };

  getData = async () => {
    this.setState({
      loading: true
    });
    let rooms = await window.db.rooms.toArray();
    console.log(rooms);
    this.setState({
      rooms,
      loading: false
    });
  };

  componentDidMount() {
    this.getData();
  }

  renderPage(route, navigator) {
    route.props = route.props || {};
    route.props.navigator = navigator;

    return React.createElement(route.comp, route.props);
  }

  render() {
    let {rooms} = this.state
    return (
      <AppContext.Provider value={{rooms, refresh: this.getData}}>
        <Navigator
          initialRoute={{ comp: Tabs, props: { key: "tabs" } }}
          renderPage={this.renderPage}
        />
      </AppContext.Provider>
    );
  }
}

export const Context = AppContext;
export default App;
