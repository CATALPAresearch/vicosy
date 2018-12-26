import { GET_ERRORS, CLEAR_ERROR } from "./types";

export const setError = (errorCode, errorPayload) => {
  return {
    type: GET_ERRORS,
    payload: { errorCode, errorPayload }
  };
};

export const clearError = errorCode => {
  return {
    type: CLEAR_ERROR,
    payload: errorCode
  };
};
