import {
  SET_MARKER_TYPE,
  SET_ANNOTATION_TYPE,
  SET_SYNC_SHARED_DOC_IN_SYNC_SPACE,
  RESET_SETTINGS
} from "./types";

export const setMarkerType = markerType => {
  return {
    type: SET_MARKER_TYPE,
    payload: markerType
  };
};

export const setAnnotationType = annotationType => {
  return {
    type: SET_ANNOTATION_TYPE,
    payload: annotationType
  };
};

export const setSyncSharedDocInSyncSpace = sync => {
  return {
    type: SET_SYNC_SHARED_DOC_IN_SYNC_SPACE,
    payload: sync
  };
};

export const resetSettings = () => {
  return {
    type: RESET_SETTINGS,
    payload: null
  };
};
