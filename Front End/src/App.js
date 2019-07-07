import React from "react";
import { Page, Tabbar, Tab, Navigator } from "react-onsenui";
import Home from "./Pages/Home/Home";
import AddPlants from "./Pages/Add Plants/AddPlants";
import io from 'socket.io-client'
import ToastContainer from "./Notifications/ToastContainer";
import { api } from "./util";

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
    loading: false,
    socket: io(api),
    toasts: []
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

    this.state.socket.on('toast', (toast) => {
      if(toast.sound){
        new Audio(toast.sound).play();
      }

      this.setState(state => ({toasts: [...state.toasts, toast]}));
    })
  }

  renderPage(route, navigator) {
    route.props = route.props || {};
    route.props.navigator = navigator;

    return React.createElement(route.comp, route.props);
  }

  render() {
    let {rooms, toasts} = this.state
    return (
      <AppContext.Provider value={{rooms, refresh: this.getData}}>
        <Navigator
          initialRoute={{ comp: Tabs, props: { key: "tabs" } }}
          renderPage={this.renderPage}
        />
        <ToastContainer toasts={toasts}/>
      </AppContext.Provider>
    );
  }
}

export const Context = AppContext;
export default App;
