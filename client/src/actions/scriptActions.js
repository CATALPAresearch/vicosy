import axios from "axios";
import { set } from "mongoose";
import { scriptMembers, subscribeToScriptSocket } from "../socket-handlers/api";
import { DELETE_MEMBER_FROM_SCRIPT, GET_ERRORS, UPDATE_SCRIPT_PROP, GET_SCRIPTS, SET_ACT_SCRIPT, SET_WARNING, SET_SCRIPT_MEMBERS, CLEAR_SCRIPT, HOMOGEN, HETEROGEN, SHUFFLE, SET_GROUPS } from "./types";
const skmeans = require("../../node_modules/skmeans");


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
    .post("/api/script/getscriptsbyuserid", value)
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


// delete Member in Script 
export const deleteMemberFromScript = (member_id, script) => dispatch => {
  console.log(script);

  for (var i = 0; i < script.participants.length; i++) {
    if (script.participants[i].id == member_id)
      script.participants.splice(i, 1);

  }
  if (script.groups)
    for (let group of script.groups) {
      for (var i = 0; i < group.groupMembers.length; i++) {
        if (group.groupMembers[i].id == member_id)
          group.groupMembers.splice(i, 1);

      }

    }

  dispatch({
    type: DELETE_MEMBER_FROM_SCRIPT,
    payload: script
  });

}

//create Script and store it in db
export const createScript = (scriptData, setScript, changeToGroups) => dispatch => {
  console.log("create Script");
  console.log(scriptData);
  axios
    .post("/api/script/newscript", scriptData)
    .then(res => {
      setScript(res.data);
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data
      });
      changeToGroups();
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
    .post("/api/script/deleteallscripts", { _id: _id })
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
    .post("/api/script/deletescript", { _id: _id })
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
    .post("/api/script/updatescript", scriptData)
    .then(res => {
      console.log(res);
      /*
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data
      });*/
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
          var group = { _id: "", groupMembers: [] };
          //var groupMembers=[];
          while (Array.isArray(memberArray) && memberArray.length > 0) {
            let memberPosition = getRandomInt(0, memberArray.length);
            if ((group.groupMembers.length >= (groupSize))) {
              groups.push(group);
              group = { _id: "", groupMembers: [] };
              //group = [];
            }
            group.groupMembers.push(memberArray[memberPosition])
            memberArray.splice(memberPosition, 1);

          }
          if (group.groupMembers.length > 0) groups.push(group);
          dispatch({
            type: SET_GROUPS,
            payload: groups
          });
        }
          break;
        case HOMOGEN: {
          var expLevels = [];
          var groups = [];

          var sizeOk = true;

          for (var i = 0; i < members.length; i++)
            expLevels.push(members[i].expLevel);

          // var groupNumber = Math.round(members.length / groupSize);

          var groupNumber;
          if ((members.length / groupSize) > Math.round(members.length / groupSize))
            groupNumber = Math.round(members.length / groupSize) + 1;
          else
            groupNumber = Math.round(members.length / groupSize);

          /*
                    for (let i = 0; i < groupNumber; i++)
                      groups[i] = { _id: "", groupMembers: [] };
          
                    members.sort((a, b) => {
                      if (a.expLevel < b.expLevel)
                        return -1;
                      if (a.expLevel > b.expLevel)
                        return 1;
                      return 0;
          
                    })
          
                    //initarray
                    var i = 0;
                    var groupNr = 0;
          
                    for (var i = 0; i < members.length; i++) {
                      if (groups[groupNr].groupMembers.length >= groupSize)
                        groupNr++;
                      groups[groupNr].groupMembers.push(members[i]);
          
          
                    }
          
                    console.log(groups);
          */


          group();

          function group() {
            console.log("groupcall");
            groups = [];

            for (var i = 0; i < groupNumber; i++)
              groups[i] = { _id: "", groupMembers: [] };


            var res = skmeans(expLevels, groupNumber);

            for (var i = 0; i < members.length; i++) {
              groups[res.idxs[i]].groupMembers.push(members[i]);
            }
            sizeOk = true;
            for (var i = 0; i < groups.length; i++) {
              if (groups[i].groupMembers.length > groupSize)
                sizeOk = false;

            }
            if (!sizeOk)
              group();

          }


          dispatch({
            type: SET_GROUPS,
            payload: groups
          });

        }
          break;
        case HETEROGEN: {

          var groupNumber;
          var groups = [];


          if ((members.length / groupSize) > Math.round(members.length / groupSize))
            groupNumber = Math.round(members.length / groupSize) + 1;
          else
            groupNumber = Math.round(members.length / groupSize);



          for (let i = 0; i < groupNumber; i++)
            groups[i] = { _id: "", groupMembers: [] };

          members.sort((a, b) => {
            if (a.expLevel < b.expLevel)
              return -1;
            if (a.expLevel > b.expLevel)
              return 1;
            return 0;

          })

          //initarray
          var i = 0;
          var groupNr = 0;

          for (var i = 0; i < members.length; i++) {
            if (groupNr >= groupNumber)
              groupNr = 0
            groups[groupNr].groupMembers.push(members[i]);
            groupNr++;

          }

          console.log(groups);
          dispatch({
            type: SET_GROUPS,
            payload: groups
          });

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
    .post("/api/script/getscriptbyid", script)
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
    .post("/api/script/subscribetoscript", options)
    .then(res => {
      subscribeToScriptSocket(res.data._id);
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

}