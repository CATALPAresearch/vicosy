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
  SET_UNSEEN_ACTIVITIES
} from "../actions/types";
import { shareLocalState } from "../socket-handlers/api";

// TODO: move properties that are only used for sharing (remoteState) to a new sharedState reducer
const initialState = {
  annotationEditing: null, // local & remote
  sharedDocEditing: { isOpen: false }, // local & remote
  syncState: { sync: true, asyncTimestamp: 0 }, // local & remote
  focusState: { appInFocus: true }, // local and remote
  sections: {
    highlights: [
      /*{start: secNum end: secNum style: string}*/
    ]
  }, // local only
  scrubState: { sync: true, perc: -1 }, // remote only my current scrub percent in sync space
  sideBarTab: { activeTab: "activities-tab" }, // local only activities-tab / notes-tab
  unseenActivities: { count: 0 } // local only
};

// threshold that defines when to update the scrub percent value on movement
const scrubPercUpdateDelta = 0.01;

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ANNOTATION_EDITING:
      return shareAndGetLocalState(state, "annotationEditing", action.payload);
    case CLEAR_ANNOTATION_EDITING:
      return shareAndGetLocalState(state, "annotationEditing", null);
    case SET_SYNC_STATE:
      return shareAndGetLocalState(state, "syncState", action.payload);
    case SET_ASYNC_TIME:
      var nextSyncState = { ...state.syncState };
      nextSyncState.asyncTimestamp = action.payload;
      return shareAndGetLocalState(state, "syncState", nextSyncState);
    case SET_SHARED_DOC_EDITING:
      const nextDocState = { ...state.sharedDocEditing };
      nextDocState.isOpen = action.payload;
      return shareAndGetLocalState(state, "sharedDocEditing", nextDocState);
    case SET_APP_FOCUS_STATE:
      const nextFocusState = { ...state.focusState };
      nextFocusState.appInFocus = action.payload;
      return shareAndGetLocalState(state, "focusState", nextFocusState);
    case SET_SYNC_SCRUB_PERC:
      const lastSetScrubPerc = state.scrubState.perc;
      const nextScrubPerc = action.payload;

      if (lastSetScrubPerc !== -1 && nextScrubPerc !== -1) {
        const delta = Math.abs(lastSetScrubPerc - nextScrubPerc);
        if (delta < scrubPercUpdateDelta) return state;
      }

      const nextScrubState = { ...state.scrubState };
      nextScrubState.perc = nextScrubPerc;
      return shareAndGetLocalState(state, "scrubState", nextScrubState);
    case SET_SECTION_HIGHLIGHTS:
      const nextSections = { ...state.sections };
      nextSections.highlights = action.payload;
      return {
        ...state,
        sections: nextSections
      };
    case SELECT_SIDEBAR_TAB:
      const nextTab = { ...state.sideBarTab };
      nextTab.activeTab = action.payload;
      return {
        ...state,
        sideBarTab: nextTab
      };
    case SET_UNSEEN_ACTIVITIES:
      const nextUnseen = { ...state.unseenActivities };
      nextUnseen.count = action.payload;
      return {
        ...state,
        unseenActivities: nextUnseen
      };
    case RESET_LOCAL_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

function shareAndGetLocalState(reducerState, key, value) {
  if (window.activeSessionId)
    shareLocalState(window.activeSessionId, key, value);

  return {
    ...reducerState,
    [key]: value
  };
}
