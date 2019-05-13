import React from 'react';
import ReactDOM from 'react-dom';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
