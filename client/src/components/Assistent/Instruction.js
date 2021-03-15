import React, { Component } from "react";
import "./instruction.css";
class InstructionUi extends Component {
    render() {
        const nextInstruction = this.props.nextInstruction;
        const previousInstruction = this.props.previousInstruction;
        return (
            <div className="instruction">
                <div className="sprechblase">
                    <div className="row">
                        <div className="col-10">
                            {this.props.instruction ? this.props.instruction.text : null}
                        </div>

                        <div className="col-2">
                            <span id="arrows">
                                {this.props.hasPrevious ?
                                    <i className="far fa-arrow-alt-circle-left fa-2x" onClick={previousInstruction}></i> : null}
                                {this.props.hasNext ?
                                    <i className="far fa-arrow-alt-circle-right fa-2x" onClick={nextInstruction}></i> : null}
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default InstructionUi;
