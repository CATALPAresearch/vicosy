import { SET_ACT_SCRIPT } from "../actions/types";
import { HOMOGEN, HETEROGEN, SHUFFLE } from "../actions/types";
import {
    SESSION_DEFAULT,
    SESSION_PEER_TEACHING
} from "../shared_constants/sessionTypes";
import isEmpty from "../validation/is-empty";

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
    participants: {}

};

export default function (state = initialState, action) {
    switch (action.type) {
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
                participants: action.payload.participants
            };

        default:
            return state;
    }
}
