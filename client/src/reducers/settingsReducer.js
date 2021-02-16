import {
  SET_MARKER_TYPE,
  SET_ANNOTATION_TYPE,
  RESET_SETTINGS,
  SET_SYNC_SHARED_DOC_IN_SYNC_SPACE
} from "../actions/types";

const initialState = {
  markerType: "marker-transient",
  annotationType: "annotation-section",
  syncSharedDocInSyncSpace: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_MARKER_TYPE:
      return {
        ...state,
        markerType: action.payload
      };
    case SET_ANNOTATION_TYPE:
      return {
        ...state,
        annotationType: action.payload
      };
    case SET_SYNC_SHARED_DOC_IN_SYNC_SPACE:
      return {
        ...state,
        syncSharedDocInSyncSpace: action.payload
      };
    case RESET_SETTINGS:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
