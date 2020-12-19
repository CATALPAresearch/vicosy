import React, { Component } from "react";
import { connect } from "react-redux";
import "./instruction.css";
class Instruction extends Component {
    constructor(props) {
        super(props);


    }


    render() {
        return (
            <div class="instruction">
                <div class="sprechblase">Das ist die erste Sprechblase mit 30% Weite.</div>
            </div>
        )
    }
}

export default Instruction;
