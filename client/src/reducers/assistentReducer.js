import { SET_INCOMING_INSTRUCTION, UPDATE_CONTINUEBUTTON, PREVIOUS_INSTRUCTION, SET_PHASE_INSTRUCTIONS, SET_ACTIVE, SET_WARNING, SET_PHASE, SET_ACT_INSTRUCTION, UNSET_ACT_INSTRUCTION, NEXT_INSTRUCTION } from "../actions/types";
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
  waitingForOthers: false,
  incomingInstruction: null
};

var continueMessageBlocked = false;
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INCOMING_INSTRUCTION: {
      return {
        ...state,
        incomingInstruction: action.payload
      };

    }
    case UPDATE_CONTINUEBUTTON:
      if (state.phase && !continueMessageBlocked) {
        continueMessageBlocked = true;
        setTimeout(() => { continueMessageBlocked = false; }, 500);
        /* var newInstruction = {};
         var newPhase = state.phase;
         */
        var newInstruction = {};
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
          newInstruction = new Instruction("Du hast die Phase beendet, warte auf deinen Partner!", "");
          /*
           newPhase.instructions = state.phase.instructions;
           if (newPhase.instructions) {
             newPhase.instructions.splice(newPhase.instructions.length - 1, 1, newInstruction);
             newPhase.pointer = newPhase.instructions.length - 1;
           }
           */
          /*
            if (newPhase.instructions[state.phase.pointer + 1])
              newPhase.instructions.splice(state.phase.pointer + 1, 0, newInstruction);
            else
              newPhase.instructions.push(newInstruction);
          newPhase.pointer = state.phase.pointer + 1;*/
        }
        else
          if (!action.payload.meIsReady && action.payload.meIsRequired && !action.payload.waitingForOthers) {
            newInstruction = new Instruction("Dein Partner hat die Phase beendet. Hier kannst du sie ebenfalls beenden!", new Array(new Options("right", "id", "toggle-switch", 15, 20)));
            /*           
                        newPhase.instructions = state.phase.instructions;
                        if (newPhase.instructions) {
                          newPhase.instructions.splice(newPhase.instructions.length - 1, 1, newInstruction);
                          newPhase.pointer = newPhase.instructions.length - 1;
                        }
              */
            /*
            
              if (newPhase.instructions[state.phase.pointer + 1])
                newPhase.instructions.splice(state.phase.pointer + 1, 0, newInstruction);
              else
                newPhase.instructions.push(newInstruction);
            newPhase.pointer = state.phase.pointer + 1; */

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
          incomingInstruction: newInstruction,
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
