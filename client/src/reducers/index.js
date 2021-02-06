import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import roomsReducer from "./roomsReducer";
import settingsReducer from "./settingsReducer";
import localStateReducer from "./localStateReducer";
import restrictionReducer from "./restrictionReducer";
import scriptReducer from "./scriptReducer";
import assistentReducer from "./assistentReducer";
import docReducer from "./docReducer";
export default combineReducers({
  auth: authReducer, // global auth data
  errors: errorReducer, // global app errors
  rooms: roomsReducer, // data by rooms I'm part of
  settings: settingsReducer, // feature states manipulated by me => todo: move to localStateReducer
  localState: localStateReducer, // my own session data that is shared in current session (will become remoteState in shared data for others)
  restrictions: restrictionReducer, // features access state
  script: scriptReducer, //actual script
  assistent: assistentReducer, //assistent
  docs: docReducer //collaborative Document

});
