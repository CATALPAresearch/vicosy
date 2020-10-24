import axios from "axios";
import { GET_ERRORS } from "./types";
import jwt_decode from "jwt-decode";

// Store Script User
export const createScript = scriptData => dispatch => {
  axios
    .post("api/script/newscript", scriptData)
    .then(res => console.log("Rücklauf vom Backend")).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};



