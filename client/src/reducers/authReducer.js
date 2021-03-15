import { SET_CURRENT_USER } from "../actions/types";
const initialState = {
  isAuthenticated: false,
  user: {},
  token: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      //const isAuth = !isEmpty(action.payload);

      if (action.payload.token) {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.decoded,
          token: action.payload.token
        };
      } else {
        return {
          ...state,
          isAuthenticated: false,
          user: {},
          token: null
        };
      }
    default:
      return state;
  }
}
