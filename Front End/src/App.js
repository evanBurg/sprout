import React from 'react';

import {
  Page,
  Tabbar,
  Tab,
  Navigator
} from 'react-onsenui';

import Home from './Pages/Home/Home';
import AddPlants from './Pages/Add Plants/AddPlants';

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
      },
    ];
  }

  render() {
    return (
      <Page>
        <Tabbar
          renderTabs={this.renderTabs}
        />
      </Page>
    );
  }
}

class App extends React.Component {

  renderPage(route, navigator) {
    route.props = route.props || {};
    route.props.navigator = navigator;

    return React.createElement(route.comp, route.props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{comp: Tabs, props: { key: 'tabs' }}}
        renderPage={this.renderPage}
      />
    );
  }
}

export default App;