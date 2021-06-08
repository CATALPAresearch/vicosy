import axios from "axios";
import { encodeBase64 } from "bcryptjs";
import { removedScript, getSessions, scriptMembers, notifyMembers, subscribeToScriptSocket } from "../socket-handlers/api";
import { SET_SESSION_ID, DELETE_MEMBER_FROM_SCRIPT, GET_ERRORS, UPDATE_SCRIPT_PROP, GET_SCRIPTS, SET_ACT_SCRIPT, CLEAR_SCRIPT, HOMOGEN, HETEROGEN, SHUFFLE, SET_GROUPS } from "./types";
const skmeans = require("../../node_modules/skmeans");


export const setSessionId = (session_id) => dispatch => {


    dispatch({ type: SET_SESSION_ID, payload: session_id })


}

export const checkRemovedScript = (user_id, scripts, actualize) => dispatch => {
  removedScript(user_id, (script_id) => {
    console.log("Script removed");
    actualize();
    if (!scripts)
      scripts = {};
    else
      for (var i = 0; i < scripts.length; i++) {

        if (scripts[i]._id === script_id) {
          scripts.splice(i, 1);

        }
      }
  
    dispatch({ type: GET_SCRIPTS, payload: scripts }
    );
  }
  )

}
export const getMyScriptsBySocket = (user_id, scripts, callback) => dispatch => {

  getSessions(user_id, (script) => {
    scripts.push(script);
    callback();

    dispatch({ type: GET_SCRIPTS, payload: scripts }
    );

  });
}


//gets Scripts where user is member
export const getMyScripts = (user_id, callback) => dispatch => {
  let value = { userId: user_id };
  axios
    .post("/api/script/getmyscripts", value)
    .then(res => {
      dispatch({
        type: GET_SCRIPTS,
        payload: res.data.scripts
      });
      callback();
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
      });
    });

}
//get members in a script
export const getScriptMembers = (script_id, user_id) => dispatch => {
  scriptMembers(
    script_id, user_id,
    update => {
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: update
      });
    }
  );
}

//get Script of one User
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

//Trainer starts script
export const startScript = (script) => dispatch => {

  axios
    .post("/api/script/updatescript", script)
    .then(res => {
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data
      });

      axios
        .post("/api/script/startscript", { _id: script._id })
        .then(res => {
          notifyMembers(res.data);

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




    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });



}


// delete Member in Script 
export const deleteMemberFromScript = (member_id, script) => dispatch => {

   for (let i = 0; i < script.participants.length; i++) {
    if (script.participants[i]._id === member_id)
      script.participants.splice(i, 1);

  }
  if (script.groups)
    for (let group of script.groups) {
      for (let i = 0; i < group.groupMembers.length; i++) {
        if (group.groupMembers[i]._id === member_id)
          group.groupMembers.splice(i, 1);

      }

    }

  dispatch({
    type: DELETE_MEMBER_FROM_SCRIPT,
    payload: script
  });

}

//create Script and store it in db
export const createScript = (scriptData, setScript, changeToGroups, cb) => dispatch => {
  console.log("create Script");
   axios
    .post("/api/script/newscript", scriptData)
    .then(res => {
      setScript(res.data);
      cb();
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
        payload: res.data._id
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
export const updateScript = (scriptData, cb) => dispatch => {

  axios
    .post("/api/script/updatescript", scriptData)
    .then(res => {
      cb();
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




//build  
export const mixGroups = (method, members, groupSize) => dispatch => {
  var memberscopy=JSON.parse(JSON.stringify(members));
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

      var groupNumber;
      var groups = [];
      var memberArray = Object.values(members);
      for (var i = 0; i < memberArray.length; i++)
        switch (method) {
          case SHUFFLE: {
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
            
            if ((members.length / groupSize) > Math.round(members.length / groupSize))
              groupNumber = Math.round(members.length / groupSize) + 1;
            else
              groupNumber = Math.round(members.length / groupSize);


       
            for (let i = 0; i < groupNumber; i++)
              groups[i] = { _id: "", groupMembers: [] };


              memberscopy.sort((a, b) => {
              if (a.expLevel < b.expLevel)
                return -1;
              if (a.expLevel > b.expLevel)
                return 1;
              return 0;

            })


            var groupNr = 0;

            for (let i = 0; i < memberscopy.length; i++) {
                         
              groups[groupNr].groupMembers.push(memberscopy[i]);
              if (i%2 == 1) 
              groupNr++;
            
            }

            /*
            var expLevels = [];


            var sizeOk = true;

            for (let i = 0; i < members.length; i++)
              expLevels.push(members[i].expLevel);

            // var groupNumber = Math.round(members.length / groupSize);
            if ((members.length / groupSize) > Math.round(members.length / groupSize))
              groupNumber = Math.round(members.length / groupSize) + 1;
            else
              groupNumber = Math.round(members.length / groupSize);



            group();

            function group() {
              console.log("groupcall");
              groups = [];

              for (var i = 0; i < groupNumber; i++)
                groups[i] = { _id: "", groupMembers: [] };


              var res = skmeans(expLevels, groupNumber);

              for (let i = 0; i < members.length; i++) {
                groups[res.idxs[i]].groupMembers.push(members[i]);
              }
              sizeOk = true;
              for (let i = 0; i < groups.length; i++) {
                if (groups[i].groupMembers.length > groupSize)
                  sizeOk = false;

              }
              if (!sizeOk)
                group();

            }

*/
            dispatch({
              type: SET_GROUPS,
              payload: groups
            });


          }
            break;
          case HETEROGEN: {



            if ((members.length / groupSize) > Math.round(members.length / groupSize))
              groupNumber = Math.round(members.length / groupSize) + 1;
            else
              groupNumber = Math.round(members.length / groupSize);



            for (let i = 0; i < groupNumber; i++)
              groups[i] = { _id: "", groupMembers: [] };

              memberscopy.sort((a, b) => {
              if (a.expLevel < b.expLevel)
                return -1;
              if (a.expLevel > b.expLevel)
                return 1;
              return 0;

            })


            var groupNr = 0;

            for (let i = 0; i < memberscopy.length; i++) {
              if (groupNr >= groupNumber)
                groupNr = 0
              groups[groupNr].groupMembers.push(memberscopy[i]);
              groupNr++;

            }
            dispatch({
              type: SET_GROUPS,
              payload: groups
            });

          }
            break;
          default:
            return;
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
  let script = { _id: scriptId };
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



//get Script by GroupId
export const getScriptByGroupId = (groupId, callback) => dispatch => {
  let group = { _id: groupId };
  axios
    .post("/api/script/getscriptbygroup", group)
    .then(res => {
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data.qScript
      });
      callback();
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
}



//get Script by Id
export const getScriptByIdCallback = (scriptId, callback) => dispatch => {
  let script = { _id: scriptId };
  axios
    .post("/api/script/getscriptbyid", script)
    .then(res => {
      dispatch({
        type: SET_ACT_SCRIPT,
        payload: res.data.script
      });
      callback();
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
}



export const subScribeToScript = (userId, name, expLevel, scriptId, role, callback) => dispatch => {

  let options =
  {
    userId: userId,
    name: name,
    expLevel: expLevel,
    scriptId: scriptId,
    role: role
  }
  axios
    .post("/api/script/subscribetoscript", options)
    .then(res => {
      subscribeToScriptSocket(res.data._id);
      callback();
    }).catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });

}

