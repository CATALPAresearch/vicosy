import React, { Component } from "react";
import { connect } from "react-redux";
import "./instruction.css";
class Instruction extends Component {
    constructor(props) {
        super(props);


    }


    render() {
        return (
            <div className="instruction">
                <div className="sprechblase">
                    {this.props.instruction.text}
                </div>
            </div>
        )
    }
}

export default Instruction;
