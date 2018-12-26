import { GET_ERRORS, CLEAR_ERRORS, CLEAR_ERROR } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      const errorCode = action.payload.errorCode;
      const errorPayload = action.payload.errorPayload;

      if (!errorCode && !errorPayload) return action.payload;

      console.log("setError", errorCode, errorPayload);

      return {
        ...state,
        [errorCode]: errorPayload
      };
    case CLEAR_ERROR:
      const errorCodeToClear = action.payload;

      console.log("clearError", errorCodeToClear);
      if (!state[errorCodeToClear]) return state;

      const curState = JSON.parse(JSON.stringify(state)); // clone state
      delete curState[errorCodeToClear];
      return curState;

    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
