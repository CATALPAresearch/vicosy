import axios from "axios";

// Register User
export const newScript = (scriptData) => dispatch => {
  const { userId, videourl, sessionname, sessionType, groupSize, groupMix, themes, isPhase0, isPhase5, phase0Assignment, phase5Assignment } =scriptData;
  axios
    .post("api/users/script", userData)
    .then(res => {
      history.push("/newScript");
      //hier irgendeine lokale Aktion ausführen;
  })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
