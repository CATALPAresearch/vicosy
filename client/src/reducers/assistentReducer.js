import { SET_ACTIVE, SET_WARNING } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  warningMessage: "",
  active: true
};

export default function (state = initialState, action) {
  switch (action.type) {
     case SET_ACTIVE:
      return {
        ...state,
        active: !state.active
      };
    case SET_WARNING:
      return {
        ...state,
        warningMessage: action.payload
      };

    default:
      return state;
  }
}
