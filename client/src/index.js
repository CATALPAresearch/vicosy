// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

// 14.01. unregistered service worker since problems with caching, see https://github.com/facebook/create-react-app/issues/1910

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { unregister } from "./registerServiceWorker";
unregister();

ReactDOM.render(<App />, document.getElementById("root"));
