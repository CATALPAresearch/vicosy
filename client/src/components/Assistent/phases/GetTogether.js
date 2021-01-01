import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
export class GetTogether extends AbstractPhase {
    constructor() {
        super();
        this.instructions.push(new Instruction("Die erste Anweisung", ""));
    }

}