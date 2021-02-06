import {SET_INDIV_TEXT} from "../actions/types";

const initialState = {
  indivText: ""
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INDIV_TEXT:
return {
        ...state,
        indivText: action.payload
      };
    default:
      return state;
  }
}
