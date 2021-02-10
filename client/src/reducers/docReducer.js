import { SET_INDIV_TEXT, SET_COLLAB_TEXT,UDPATE_COLLAB_TEXT } from "../actions/types";
import { Delta } from "rich-text";


const initialState = {
  indivText: "",
  collabText: new Delta("")
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INDIV_TEXT:
      return {
        ...state,
        indivText: action.payload
      };
    case SET_COLLAB_TEXT:
      return {
        ...state,
        collabText: action.payload
      };
      case UDPATE_COLLAB_TEXT:
        return {
        ...state,
        collabText: state.collabText.compose(action.payload)
      };
    default:
      return state;
  }





}
