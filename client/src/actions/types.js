export const GET_ERRORS = "GET_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const UPDATE_ROOM = "UPDATE_ROOM";
export const UPDATE_PLAYTIME = "UPDATE_PLAYTIME"; // e.g. by heartbeat data
export const ROOM_USERS = "ROOM_USERS";
export const SENT_REQUEST = "SENT_REQUEST";
export const LOG_TO_CHAT = "LOG_TO_CHAT";

export const SET_MEDIA_STREAM = "SET_MEDIA_STREAM";
export const CLEAR_MEDIA_STREAM = "CLEAR_MEDIA_STREAM";

// settings actions
export const SET_MARKER_TYPE = "SET_MARKER_TYPE"; // marker-none, marker-transient, marker-persistent
export const SET_ANNOTATION_TYPE = "SET_ANNOTATION_TYPE"; // annotation, split-annotation
export const SET_SYNC_SHARED_DOC_IN_SYNC_SPACE =
  "SET_SYNC_SHARED_DOC_IN_SYNC_SPACE"; // defines wether to sync opening of shared doc in sync space
export const RESET_SETTINGS = "RESET_SETTINGS"; // reset to default

// local states
export const SET_ANNOTATION_EDITING = "SET_ANNOTATION_EDITING"; // {playtime}
export const CLEAR_ANNOTATION_EDITING = "CLEAR_ANNOTATION_EDITING";

export const SET_SYNC_STATE = "SET_SYNC_STATE"; // true/false
export const SET_ASYNC_TIME = "SET_ASYNC_TIME"; // timestamp

export const SET_SHARED_DOC_EDITING = "SET_SHARED_DOC_EDITING"; // true/false

export const SET_APP_FOCUS_STATE = "SET_APP_FOCUS_STATE"; // true/false

export const SET_SECTION_HIGHLIGHTS = "SET_SECTION_HIGHLIGHTS"; // [{start: secNum end: secNum style: string}]
export const SET_SYNC_SCRUB_PERC = "SET_SYNC_SCRUB_PERC"; // perc: float between 0 and 1, -1 if not scrubbing

export const SELECT_SIDEBAR_TAB = "SELECT_SIDEBAR_TAB"; // activities-tab, notes-tab

export const SET_UNSEEN_ACTIVITIES = "SET_UNSEEN_ACTIVITIES"; // set the amount of unseen messages

export const RESET_LOCAL_STATE = "RESET_LOCAL_STATE"; // reset all properties to initial state

export const OPEN_PUBLIC_GUIDE = "OPEN_PUBLIC_GUIDE"; // url: string, [simpleConfirmation: bool]
export const CLOSE_PUBLIC_GUIDE = "CLOSE_PUBLIC_GUIDE"; // url: string

// restrictions
export const ENABLE_FEATURES = "ENABLE_FEATURES"; // features or empty to enable all
export const DISABLE_FEATURES = "DISABLE_FEATURES"; // features or empty to disable all

// roles
export const TRAINER = "TRAINER";
export const STUDENT = "STUDENT";

// group mix

export const HOMOGEN = "HOMOGEN";
export const HETEROGEN = "HETEROGEN";
export const SHUFFLE = "SHUFFLE";

//Script
export const SET_ACT_SCRIPT = "SET_ACT_SCRIPT";
export const UPDATE_SCRIPT_PROP = "UPDATE_SCRIPT_PROP";
export const SET_SCRIPT_MEMBERS = "SET_SCRIPT_MEMBERS";
export const GET_SCRIPTS ="GET_SCRIPTS";
export const CLEAR_SCRIPT ="CLEAR_SCRIPT";
export const SET_GROUPS="SET_GROUPS";
export const DELETE_MEMBER_FROM_SCRIPT ="DELETE_MEMBER_FROM_SCRIPT";
export const GET_SESSIONS="GET_SESSIONS";
export const REMOVE_SCRIPT="REMOVE_SCRIPT";
//iTutor
export const SET_WARNING = "SET_WARNING";