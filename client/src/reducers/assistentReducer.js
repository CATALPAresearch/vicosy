import { UPDATE_CONTINUEBUTTON, PREVIOUS_INSTRUCTION, SET_PHASE_INSTRUCTIONS, SET_ACTIVE, SET_WARNING, SET_PHASE, SET_ACT_INSTRUCTION, UNSET_ACT_INSTRUCTION, NEXT_INSTRUCTION } from "../actions/types";
import isEmpty from "../validation/is-empty";
import Instruction from "../components/Assistent/phases/Instruction"
import Options from "../components/Assistent/phases/Options"
const initialState = {
  warningMessage: "",
  active: false,
  phase: null,
  actInstruction: null,
  meIsRequired: false,
  meIsReady: false,
  waitingForOthers: false
};


export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONTINUEBUTTON:
      if (state.phase) {
        var newInstruction = {};
        var newPhase = state.phase;
        /*
                if (!action.payload.meIsReady && action.payload.meIsRequired && action.payload.waitingForOthers) {
                   newInstruction = new Instruction("Beende hiermit die Phase!", new Array(new Options("right", "id", "ready-to-finish", 10, 0)));
                   if  (state.phase.instructions[state.phase.pointer + 1])
                                newPhase.instructions = state.phase.instructions.splice(state.pointer+1, 0, newInstruction);
                    else
                    {
                      newPhase.instructions = state.phase.instructions;
                      newPhase.instructions.push(newInstruction)
                    }
                                newPhase.pointer = state.phase.pointer + 1; 
                                
                }
                else */

        if (action.payload.meIsReady && action.payload.meIsRequired && action.payload.waitingForOthers) {
          newInstruction = new Instruction("Du hast die Phase beendet, warte auf deinen Partner!", new Array(new Options("right", "id", "ready-to-finish", 30, 30)));
          newPhase.instructions = state.phase.instructions;
          newPhase.instructions.splice(state.phase.pointer, 0, newInstruction);
          newPhase.pointer = state.phase.pointer + 1;
        }
        else
          if (!action.payload.meIsReady && action.payload.meIsRequired && !action.payload.waitingForOthers) {
            newInstruction = new Instruction("Dein Partner hat die Phase beendet. Hier kannst du sie ebenfalls beenden.!", new Array(new Options("right", "id", "ready-to-finish", 30, 30)));
            newPhase.instructions = state.phase.instructions;
            newPhase.instructions.splice(state.phase.pointer, 0, newInstruction);
            newPhase.pointer = state.phase.pointer + 1;
          }
          else
            return {
              ...state,
              meIsRequired: action.payload.meIsRequired,
              meIsReady: action.payload.meIsReady,
              waitingForOthers: action.payload.waitingForOthers,

            };

        return {
          ...state,
          meIsRequired: action.payload.meIsRequired,
          meIsReady: action.payload.meIsReady,
          waitingForOthers: action.payload.waitingForOthers,
          actInstruction: newInstruction,
          phase: newPhase

        };
      }
      else {
        return {
          ...state,
          meIsRequired: action.payload.meIsRequired,
          meIsReady: action.payload.meIsReady,
          waitingForOthers: action.payload.waitingForOthers,

        };
      }



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
