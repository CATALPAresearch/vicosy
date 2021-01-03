import React, { Component, useRef } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import assi_on from './images/lehrer.png';
import assi_off from './images//lehrer_aus.png';
import Instruction from "./Instruction";
import AssistentController from "./AssistentController";
import { setPhase, setActInstruction, nextInstruction, previousInstruction } from "../../actions/assistentActions";
import { faAllergies } from "@fortawesome/free-solid-svg-icons";
import Xarrow from "react-xarrows";

class Assistent extends Component {

    constructor(props) {
        super(props);
        this.state = { display: "none" };
        this.assistentControlRef = null;
        
        

    }

    nextInstruction() {
        if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1]) {
            this.props.nextInstruction();
        }
        else return null;

    }

    previousInstruction() {
        if (this.props.assistent.phase.pointer > 0) {
            this.props.previousInstruction();
        }
        else return null;

    }

    getActInstruction() {
        if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer])
            return this.props.assistent.phase.instructions[this.props.assistent.phase.pointer];
        else return null;
    }
    render() {
     
        return (
            
            <div id="assistent">

                         <Xarrow
                    start="assistent" //can be react ref
                    startAnchor="middle"
                    end="chat-write" //or an id
                    endAnchor="middle"
                />



                <div id="overlay" style={{ display: this.state.display }}>
                    <div id="text">
                        test
                    </div>
                </div>


                <div className="panel" id="laempel">
                    <img src={assi_on} alt="Laempel" width="100%" height="100%" />
                </div>

                <AssistentController createRef={el => (this.assistentControlRef = el)} />


                <Instruction
                    hasNext={this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1] ? true : false}
                    hasPrevious={this.props.assistent.phase.pointer > 0 ? true : false}
                    instruction={this.props.assistent.actInstruction}
                    nextInstruction={this.nextInstruction.bind(this)}
                    previousInstruction={this.previousInstruction.bind(this)}
                />


            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    assistent: state.assistent
});

export default connect(
    mapStateToProps, { AssistentController, nextInstruction, previousInstruction }
)(withRouter(Assistent));


