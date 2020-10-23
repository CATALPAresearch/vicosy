import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const newScript = (scriptData) => dispatch => {
  console.log(scriptData);
  console.log("Preparing save of new Script");
  const { userId, videourl, sessionname, sessionType, groupSize, groupMix, themes, isPhase0, isPhase5, phase0Assignment, phase5Assignment } = scriptData;
  axios
    .post("api/script/newscript", scriptData)
    .then(res => {

      //history.push("/trainerlobby");
      console.log(res);
      //hier irgendeine lokale Aktion ausführen;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
