import { SET_CURRENT_USER, SET_WARNING } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  warningMessage: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_WARNING:
      return {
        ...state,
        warningMessage: action.payload
      };

    default:
      return state;
  }
}
