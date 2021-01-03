import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
export class WarmUp extends AbstractPhase {
    constructor() {
        super();
        this.name="WARMUP";
        this.instructions.push(new Instruction("Stell dich deinem Partner vor!", ""));
        this.instructions.push(new Instruction("Du kannst den Chat dafür nutzen!", new Array("chat-write")));
    }

}