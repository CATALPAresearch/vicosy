import { SET_INCOMING_INSTRUCTION, NEW_INSTRUCTION, UPDATE_CONTINUEBUTTON, NEXT_INSTRUCTION, SET_ACTIVE, SET_ACT_INSTRUCTION, SET_PHASE, PREVIOUS_INSTRUCTION } from "./types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { isActive, listenActiveMessage, sendTabLostMsg } from "../socket-handlers/api";


export const sendActiveMessage = (sessionId, userId, userName, clients) => dispatch => {
  isActive(sessionId, userId, userName, clients);

}

export const sendTabLostMessage = (sessionId, userId, userName, clients) => dispatch => {
  sendTabLostMsg(sessionId, userId, userName, clients);

}

export const updateContinueButton = (meIsRequired, meIsReady, waitingForOthers) => dispatch => {
  setActInstruction(null);
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
//instruction has format {Instrucion {text, markers [] }}
export const newInstruction = (newInstruction) => dispatch => {
  setActInstruction(null);
  dispatch({
    type: NEW_INSTRUCTION,
    payload: newInstruction
  });
};


export const setIncominginstruction = (incomingInstruction) => dispatch => {
  dispatch({
    type: SET_INCOMING_INSTRUCTION,
    payload: incomingInstruction
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
