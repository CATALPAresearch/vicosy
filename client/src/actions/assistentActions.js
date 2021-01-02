import { SET_ACTIVE, SET_ACT_INSTRUCTION, SET_PHASE } from "./types";

import React, { Component } from "react";
import { connect } from "react-redux";

export const setPhase = (phase) => dispatch => {
  dispatch({
    type: SET_PHASE,
    payload: phase
  });
};



export const setActInstruction = (instruction) => dispatch => {
  dispatch({
    type: SET_ACT_INSTRUCTION,
    payload: instruction
  });
};




export const setActive = (active) => dispatch => {
  dispatch({
    type: SET_ACTIVE,
    payload: active
  });
};
