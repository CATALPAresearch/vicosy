import "./observables";

import React, { Component } from "react";
import "./utils/extensionMethods";
import { BrowserRouter as Router } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { LastLocationProvider } from "react-router-last-location";

import { Provider } from "react-redux";
import store from "./store";
import AppContent from "./components/layout/AppContent";

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token & get user info & exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded, localStorage.jwtToken));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // clear current profile
    //store.dispatch(clearCurrentProfile());
    // Redirect to login
    if (window.location.pathname)
      localStorage.setItem("pathAfterLogin", window.location.pathname);

    window.location.href = "/login";
  }
} else {
  if (window.location.pathname)
    localStorage.setItem("pathAfterLogin", window.location.pathname);
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <LastLocationProvider>
            <AppContent />
          </LastLocationProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
