import React, { Component } from "react";
import { connect } from "react-redux";
import "./instruction.css";
class Instruction extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        const nextInstruction = this.props.nextInstruction;
        const previousInstruction = this.props.previousInstruction;
        return (
            <div className="instruction">
                <div className="sprechblase">
                    {this.props.instruction ? this.props.instruction.text : null}
                    <span id="arrows">
                        {this.props.hasPrevious?
                        <i className="far fa-arrow-alt-circle-left" onClick={previousInstruction}></i>:null}
                        {this.props.hasNext?
                        <i className="far fa-arrow-alt-circle-right" onClick={nextInstruction}></i>:null}
                    </span>
                </div>
            </div>
        )
    }
}

export default Instruction;
