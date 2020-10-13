import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const loginGuest = () => dispatch => {
  const guestUser = {
    email: "guest@closeup.com",
    password: "guestsecret"
  };

  dispatch(loginUser(guestUser));
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //connectSocket();
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls (window.localStorage = key/value speicher) - ls only stores strings (can convert json)
      localStorage.setItem("jwtToken", token);
      // Set token to auth header
      setAuthToken(token);
     // decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      
      dispatch(setCurrentUser(decoded, token));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set loggedinUser
export const setCurrentUser = (decoded, token) => {
  return {
    type: SET_CURRENT_USER,
    payload: { decoded, token }
  };
};

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localstorage
  localStorage.removeItem("jwtToken");
  // remove auth header for future requests
  setAuthToken(false);
  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}, null));
};
