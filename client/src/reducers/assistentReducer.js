import { SET_ACTIVE, SET_WARNING, SET_PHASE, SET_ACT_INSTRUCTION, UNSET_ACT_INSTRUCTION } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  warningMessage: "",
  active: false
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
    case SET_PHASE:
      return {
        ...state,
        phase: action.payload
      };
    case SET_ACT_INSTRUCTION:
      return {
        ...state,
        act_instruction: action.payload
      };
    case UNSET_ACT_INSTRUCTION:
      return {
        ...state,
        act_instruction: ""
      };

    default:
      return state;
  }
}
