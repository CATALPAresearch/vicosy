import axios from "axios";
import { GET_ERRORS } from "./types";
import jwt_decode from "jwt-decode";

// Store Script User
export const newScript = (scriptData) => dispatch => {
  axios
    .post("api/script/newscript", scriptData)
    .then(res => {
      console.log("Rücklauf vom Backend");
      history.push("/trainerlobby");
      console.log(res);
    }).catch(err => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

