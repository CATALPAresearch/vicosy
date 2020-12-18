import { SET_ACTIVE } from "./types";

export const setActive = (active) => dispatch => {
  dispatch({
    type: SET_ACTIVE,
    payload: active
  });
};
