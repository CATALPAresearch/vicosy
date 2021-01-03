import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
export class GetTogether extends AbstractPhase {
    constructor() {
        super();
        this.name="GETTOGETHER";
        this.instructions.push(new Instruction("Warte auf deinen Partner!", ""));
    }

}