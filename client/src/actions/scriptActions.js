import axios from "axios";
import { GET_ERRORS, SET_ACT_SCRIPT, SET_WARNING } from "./types";


//create Script and store it in db
export const createScript = (scriptData, setScript) => dispatch => {
  axios
    .post("api/script/newscript", scriptData)
    .then(res => {
      setScript(res.data);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};


//update Script and store it in db
export const updateScript = (scriptData, setScript) => dispatch => {
  axios
    .post("api/script/updatescript", scriptData)
    .then(res => {
      setScript(res.data.script);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//get Script by Id 
export const getScriptById = (scriptId) => dispatch => {
  let script = { _id: scriptId }
  axios
    .post("../api/script/getscriptbyid", script)
    .then(res => {
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data.script
      });
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
}

export const subScribeToScript = (userId, expLevel, scriptId) => dispatch => {
  let options =
  {
    userId: userId,
    expLevel: expLevel,
    scriptId: scriptId
  }
  axios
    .post("../api/script/subscribetoscript", options)
    .then(res => {
      console.log("user saved");
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

}