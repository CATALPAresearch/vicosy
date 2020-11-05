import axios from "axios";
import { set } from "mongoose";
import { scriptMembers, subscribeToScriptSocket } from "../socket-handlers/api";
import { GET_ERRORS, UPDATE_SCRIPT_PROP, SET_ACT_SCRIPT, SET_WARNING, SET_SCRIPT_MEMBERS } from "./types";


//mitglieder werden geholt
export const getScriptMembers = (script_id, user_id) => dispatch => {
  scriptMembers(
    script_id, user_id,
    update => {
      console.log(update);
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: update
      });
    }
  );
}

//Scripts eines User werden geholt
export const getScriptsByUserId = (user_id, callback) => dispatch => {
  let value = { userId: user_id };
    axios
    .post("api/script/getscriptsbyuserid", value)
    .then(res => {
      callback(res.data.scripts);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

}


//update prop in Store 
export const updateScriptProp = (prop) => dispatch => {
  dispatch({
    type: UPDATE_SCRIPT_PROP,
    payload: prop
  });

}

//create Script and store it in db
export const createScript = (scriptData, setScript) => dispatch => {
  axios
    .post("api/script/newscript", scriptData)
    .then(res => {
      setScript(res.data);
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data
      });
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
      console.log(res);
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


export const subScribeToScript = (userId, name, expLevel, scriptId) => dispatch => {
  let options =
  {
    userId: userId,
    name: name,
    expLevel: expLevel,
    scriptId: scriptId
  }
  axios
    .post("../api/script/subscribetoscript", options)
    .then(res => {
      subscribeToScriptSocket(res.data._id);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

}