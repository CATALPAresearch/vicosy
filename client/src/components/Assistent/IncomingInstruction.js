import React, { Component } from "react";
import "./instruction.css";
class IncomingInstruction extends Component {
 
    render() {
        const quit = this.props.quit;
        return (
            <div className="instruction">
                <div className="sprechblase-incoming">
                    {this.props.instruction ? this.props.instruction.text : null}
                    <span id="quit">
                        <i className="far fa-times-circle fa-2x" onClick={quit}></i>
                    </span>
                </div>
            </div>
        )
    }
}

export default IncomingInstruction;
