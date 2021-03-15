import { SET_ACT_SCRIPT } from "../actions/types";
import { GET_SESSIONS, DELETE_MEMBER_FROM_SCRIPT, HETEROGEN, UPDATE_SCRIPT_PROP, GET_SCRIPTS, CLEAR_SCRIPT, SET_GROUPS } from "../actions/types";
import {
    SESSION_PEER_TEACHING
} from "../shared_constants/sessionTypes";

const initialState = {
    _id: "",
    videourl:
        "https://dl.dropboxusercontent.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
    scriptName: "Das Script",
    groupSize: 2,
    groupMix: HETEROGEN,
    themes: "",
    errors: {},
    isPhase0: false,
    isPhase5: false,
    phase0Assignment: "",
    phase5Assignment: "",
    scriptType: SESSION_PEER_TEACHING,
    userId: "",
    showUrl: false,
    scriptUrl: "",
    started: false,
    participants: {},
    groups: [[]],
    sessions: []

};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SESSIONS: {
            return {
                ...state,
                sessions: action.payload
            }

        }
        case DELETE_MEMBER_FROM_SCRIPT: {
            return {
                ...state,
                scripts: action.payload
            }
        }
        case SET_GROUPS: {
            return {
                ...state,
                groups: action.payload
            }
        }
        case CLEAR_SCRIPT:
            {
                return {
                    ...state,
                    _id: "",
                    videourl:
                        "https://dl.dropboxusercontent.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
                    scriptName: "Das Script",
                    groupSize: 2,
                    groupMix: HETEROGEN,
                    themes: "",
                    errors: {},
                    isPhase0: false,
                    isPhase5: false,
                    phase0Assignment: "",
                    phase5Assignment: "",
                    scriptType: SESSION_PEER_TEACHING,
                    userId: "",
                    showUrl: false,
                    scriptUrl: "",
                    participants: {},
                    groups: [[]],
                    started: false
                }
            }
        case SET_ACT_SCRIPT:
            //const isAuth = !isEmpty(action.payload);
            console.log(action.payload);
            return {
                ...state,
                _id: action.payload._id,
                videourl: action.payload.videourl,
                scriptName: action.payload.scriptName,
                groupSize: action.payload.groupSize,
                groupMix: action.payload.groupMix,
                themes: action.payload.themes,
                isPhase0: action.payload.isPhase0,
                isPhase5: action.payload.isPhase5,
                phase0Assignment: action.payload.phase0Assignment,
                phase5Assignment: action.payload.phase5Assignment,
                scriptType: action.payload.scriptType,
                userId: action.payload.userId,
                participants: action.payload.participants,
                groups: action.payload.groups,
                started: action.payload.started
            };
        case GET_SCRIPTS: {
            return {
                ...state,
                scripts: action.payload
            }

        }

        case UPDATE_SCRIPT_PROP:

            switch (Object.keys(action.payload)[0]) {
                case "_id":
                    return {
                        ...state,
                        _id: action.payload._id

                    }
                case "videourl":
                    return {
                        ...state,
                        videourl: action.payload.videourl
                    }
                case "scriptName":
                    return {
                        ...state,
                        scriptName: action.payload.scriptName
                    }
                case "groupSize":
                    return {
                        ...state,
                        groupSize: action.payload.groupSize
                    }
                case "groupMix":
                    return {
                        ...state,
                        groupMix: action.payload.groupMix
                    }
                case "themes":
                    return {
                        ...state,
                        themes: action.payload.themes
                    }
                case "isPhase0":
                    return {
                        ...state,
                        isPhase0: action.payload.isPhase0
                    }
                case "isPhase5":
                    return {
                        ...state,
                        isPhase5: action.payload.isPhase5
                    }
                case "phase0Assignment":
                    return {
                        ...state,
                        phase0Assignment: action.payload.phase0Assignment
                    }
                case "phase5Assignment":
                    return {
                        ...state,
                        phase5Assignment: action.payload.phase5Assignment
                    }
                case "scriptType":
                    return {
                        ...state,
                        scriptType: action.payload.scriptType
                    }
                case "userId":
                    return {
                        ...state,
                        userId: action.payload.userId
                    }
                case "participants":
                    return {
                        ...state,
                        participants: action.payload.participants
                    }
                default: return state;



            }

        /*return {
            ...state,
            
        }*/

        default:
            return state;
    }
}


