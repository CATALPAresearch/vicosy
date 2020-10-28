import axios from "axios";
import { GET_ERRORS, SET_ACT_SCRIPT } from "./types";


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
      console.log(res.data);
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data.script
      });
    }).catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.data
      });
    });
}

export const subScribeToScript = (userId, expLevel) => dispatch => {

}