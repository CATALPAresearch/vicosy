import { UPDATE_CONTINUEBUTTON, NEXT_INSTRUCTION, SET_ACTIVE, SET_ACT_INSTRUCTION, SET_PHASE, PREVIOUS_INSTRUCTION } from "./types";

import React, { Component } from "react";
import { connect } from "react-redux";

export const updateContinueButton = (meIsRequired, meIsReady, waitingForOthers) => dispatch => {
  let buttonOptions = {};
  buttonOptions.meIsRequired = meIsRequired;
  buttonOptions.meIsReady = meIsReady;
  buttonOptions.waitingForOthers = waitingForOthers;
  dispatch({
    type: UPDATE_CONTINUEBUTTON,
    payload: buttonOptions
  });
}

export const setPhase = (phase) => dispatch => {
  dispatch({
    type: SET_PHASE,
    payload: phase
  });
};



export const setActInstruction = (actInstruction) => dispatch => {
  dispatch({
    type: SET_ACT_INSTRUCTION,
    payload: actInstruction
  });
};


export const nextInstruction = () => dispatch => {
  dispatch({
    type: NEXT_INSTRUCTION,
    payload: ""
  });
};


export const previousInstruction = () => dispatch => {
  dispatch({
    type: PREVIOUS_INSTRUCTION,
    payload: ""
  });
};









export const setActive = (active) => dispatch => {
  dispatch({
    type: SET_ACTIVE,
    payload: active
  });
};
