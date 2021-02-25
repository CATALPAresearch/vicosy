import {
  SET_ANNOTATION_EDITING,
  CLEAR_ANNOTATION_EDITING,
  SET_SYNC_STATE,
  SET_ASYNC_TIME,
  SET_SHARED_DOC_EDITING,
  SET_APP_FOCUS_STATE,
  SET_SECTION_HIGHLIGHTS,
  SET_SYNC_SCRUB_PERC,
  SELECT_SIDEBAR_TAB,
  RESET_LOCAL_STATE,
  SET_UNSEEN_ACTIVITIES,
  OPEN_PUBLIC_GUIDE,
  CLOSE_PUBLIC_GUIDE
} from "./types";

export const setSyncScrubPerc = percent => {
  return {
    type: SET_SYNC_SCRUB_PERC,
    payload: percent
  };
};

export const resetSyncScrubPerc = () => {
  return {
    type: SET_SYNC_SCRUB_PERC,
    payload: -1
  };
};

export const activateAnnotationEditing = playTime => {
  return {
    type: SET_ANNOTATION_EDITING,
    payload: { playTime }
  };
};

export const deActivateAnnotationEditing = () => {
  return {
    type: CLEAR_ANNOTATION_EDITING,
    payload: null
  };
};

// true / false
export const setSyncState = sync => {
  var asyncTimestamp = 0;
  if (!sync && window.playerRef && window.playerRef.current)
    asyncTimestamp = window.playerRef.current.getCurrentTime();

  return {
    type: SET_SYNC_STATE,
    payload: { sync, asyncTimestamp }
  };
};

export const setAsyncTime = timestamp => {
  return {
    type: SET_ASYNC_TIME,
    payload: timestamp
  };
};

export const setSharedDocEditing = isEditing => {
 return {
    type: SET_SHARED_DOC_EDITING,
    payload: isEditing
  };
};

export const setAppFocusState = hasFocus => {
  return {
    type: SET_APP_FOCUS_STATE,
    payload: hasFocus
  };
};

// [{start: secNum end: secNum style: string}]
export const setSectionHighlights = highlightDatas => {
  return {
    type: SET_SECTION_HIGHLIGHTS,
    payload: highlightDatas
  };
};

export const selectSidebarTabActivities = () => {
  return {
    type: SELECT_SIDEBAR_TAB,
    payload: "activities-tab"
  };
};

export const selectSidebarTabNotes = () => {
  return {
    type: SELECT_SIDEBAR_TAB,
    payload: "notes-tab"
  };
};

export const selectSidebarTabAnnotations = () => {
  return {
    type: SELECT_SIDEBAR_TAB,
    payload: "annotations-tab"
  };
};

export const resetLocalState = () => {
  return {
    type: RESET_LOCAL_STATE,
    payload: null
  };
};

export const setUnseenActivities = count => {
  return {
    type: SET_UNSEEN_ACTIVITIES,
    payload: count
  };
};

// publicUrl: path that points to content in public folder (set "" for no url change),
// confirmationMode: "simple":closes on confirmation "scriptstep":uses collaboration ready button, "none": no confirmation possible
export const openPublicGuide = (
  publicUrl = "",
  confirmationMode = "simple"
) => {
  return {
    type: OPEN_PUBLIC_GUIDE,
    payload: { publicUrl, confirmationMode }
  };
};

export const closePublicGuide = () => {
  return {
    type: CLOSE_PUBLIC_GUIDE,
    payload: null
  };
};
