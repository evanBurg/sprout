import React from 'react';
import ReactDOM from 'react-dom';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Dexie from 'dexie'
window.db = new Dexie("sprout.io");
window.db.version(1).stores({
  rooms: "++id, name, *plants"
});

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
