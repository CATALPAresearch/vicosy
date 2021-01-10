import {UPDATE_CONTINUEBUTTON,PREVIOUS_INSTRUCTION, SET_PHASE_INSTRUCTIONS, SET_ACTIVE, SET_WARNING, SET_PHASE, SET_ACT_INSTRUCTION, UNSET_ACT_INSTRUCTION, NEXT_INSTRUCTION } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  warningMessage: "",
  active: false,
  phase: null,
  actInstruction: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONTINUEBUTTON:
      return {
        ...state,
        meIsRequired: action.payload.meIsRequired,
        meIsReady: action.payload.meIsReady,
        waitingForOthers: action.payload.waitingForOthers
      };



    case NEXT_INSTRUCTION:
      const nextPhase = { ...state.phase };
      nextPhase.pointer = state.phase.pointer + 1;
      return {
        ...state,
        phase: nextPhase,
        actInstruction: state.phase.instructions[state.phase.pointer + 1]
      };

    case PREVIOUS_INSTRUCTION:
      const nextPhase1 = { ...state.phase };
      nextPhase1.pointer = state.phase.pointer - 1;
      return {
        ...state,
        phase: nextPhase1,
        actInstruction: state.phase.instructions[state.phase.pointer - 1]
      };
    case SET_ACTIVE:
      return {
        ...state,
        active: !state.active
      };
    case SET_PHASE_INSTRUCTIONS:
      return {
        ...state,
        instructions: action.payload
      };

    case SET_WARNING:
      return {
        ...state,
        warningMessage: action.payload
      };
    case SET_PHASE:
      console.log(action.payload);
      return {
        ...state,
        phase: action.payload,
        actInstruction: action.payload.instructions[action.payload.pointer]

      };
    case SET_ACT_INSTRUCTION:
      return {
        ...state,
        actInstruction: action.payload
      };
    case UNSET_ACT_INSTRUCTION:
      return {
        ...state,
        actInstruction: ""
      };

    default:
      return state;
  }
}
