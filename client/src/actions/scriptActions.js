import axios from "axios";
import { set } from "mongoose";
import { scriptMembers, subscribeToScriptSocket } from "../socket-handlers/api";
import { GET_ERRORS, UPDATE_SCRIPT_PROP, GET_SCRIPTS, SET_ACT_SCRIPT, SET_WARNING, SET_SCRIPT_MEMBERS, CLEAR_SCRIPT, HOMOGEN, HETEROGEN, SHUFFLE, SET_GROUPS } from "./types";
const skmeans = require("../../node_modules/skmeans")

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
      dispatch({
        type: GET_SCRIPTS,
        payload: res.data.scripts
      });
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
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
  console.log(scriptData);
  axios
    .post("api/script/newscript", scriptData)
    .then(res => {
      setScript(res.data);
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data
      });
    }).catch(err => {
      console.log(err)
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};




//delete Scripts from a user
export const deleteAllScripts = _id => dispatch => {
  axios
    .post("api/script/deleteallscripts", { _id: _id })
    .then(res => {
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//delete script
export const deleteScript = _id => dispatch => {
  axios
    .post("api/script/deletescript", { _id: _id })
    .then(res => {
      dispatch({
        type: CLEAR_SCRIPT,
        payload: res.response
      })
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//clear Script in Store
export const clearScript = () => dispatch => {
  dispatch({
    type: CLEAR_SCRIPT,
    payload: ""
  })

}

//update Script and store it in db
export const updateScript = scriptData => dispatch => {
  axios
    .post("api/script/updatescript", scriptData)
    .then(res => {
      console.log(res.data.script);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};




//build  
export const mixGroups = (method, members, groupSize) => dispatch => {

  if (!Array.isArray(members)) {
    let errors = { warning: "Typeerror, array as parameter expected" };
    dispatch({
      type: GET_ERRORS,
      payload: errors
    });
  }

  else {
    if (groupSize > members.length) {
      let errors = { warning: "More members needed" };
      dispatch({
        type: GET_ERRORS,
        payload: errors
      });

    }
    else {
      var memberArray = Object.values(members);
      for (var i = 0; i < memberArray.length; i++)
        var groups = [];
      switch (method) {
        case SHUFFLE: {
          let groupNr = 0;
          var group = [];
          while (Array.isArray(memberArray) && memberArray.length > 0) {
            let memberPosition = getRandomInt(0, memberArray.length);
            if ((group.length >= (groupSize - 1))) {
              groups.push(group);
              group = [];
            }
            group.push(memberArray[memberPosition])
            memberArray.splice(memberPosition, 1);

          }
          if (group.length > 0) groups.push(group);
          dispatch({
            type: SET_GROUPS,
            payload: groups
          });
        }

        case HETEROGEN: {


        }
        case SHUFFLE: {

        }
      }
    }
  }
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


}




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