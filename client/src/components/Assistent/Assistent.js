import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import assi_on from './images/lehrer.png';
import Instruction from "./phases/Instruction";
import InstructionUi from "./Instruction";
import { NoPhase } from "./phases/Phases";
import IncomingInstruction from "./IncomingInstruction";
import PhaseController from "./PhaseController";
import { setIncominginstruction, setPhase, setActInstruction, nextInstruction, previousInstruction } from "../../actions/assistentActions";
import { getScriptById } from "../../actions/scriptActions";
import { setSharedDocEditing } from "../../actions/localStateActions";



class Assistent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            arrows: {}
        };
        this.assistentControlRef = null;
        this.renderDepth = 0;
        this.toUpdate = true;
        this.isActive = this.props.isActive;


    }


    actualize() {
        //Das müsste noch gefixed werden, aber forceUpdate geht nicht!!
        //    window.location.reload();
        this.setActInstruction();

    }

    nextInstruction() {
        if (this.props.assistent.actInstruction)
            if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1]) {
                this.arrows = null;
                this.props.nextInstruction();

            }


    }

    previousInstruction() {
        this.arrows = null;
        if (this.props.assistent.actInstruction)
            if (this.props.assistent.phase.pointer > 0) {
                this.props.previousInstruction();

            }


    }

    resetInstructions() {
        this.props.setActInstruction(null);
        this.arrows = null;
    }

    getActInstruction() {
        this.arrows = null;
        if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer])
            return this.props.assistent.phase.instructions[this.props.assistent.phase.pointer];
        else return null;
    }


    setActInstruction() {
        this.arrows = null;
        //this.props.setActInstruction(null);
        if (!this.props.assistent.phase)
            this.props.setPhase(new NoPhase());
        else
            this.props.setActInstruction(this.props.assistent.phase.instructions[this.props.assistent.phase.pointer]);

    }

    deleteIncomingInstruction() {
        this.actualize();
        this.props.setIncominginstruction(null);
    }


    _handleKeyDown = (event) => {

        switch (event.keyCode) {
            case 27:
                this.deleteIncomingInstruction();
                break;
            case 37:
                this.previousInstruction();
                break;
            case 39:

                this.nextInstruction();
                break;
            default:
                return;
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this), false);

    }


    render() {


        return (
            <div id="assistent">
                <div className="panel" id="laempel">
                    <img src={assi_on} alt="Laempel" width="100%" height="100%" />
                </div>

                <PhaseController createRef={el => (this.assistentControlRef = el)} />
                {this.props.assistent.incomingInstruction ?
                    <IncomingInstruction
                        instruction={this.props.assistent.incomingInstruction}
                        quit={this.deleteIncomingInstruction.bind(this)}
                    /> : this.props.assistent.phase ?
                        (!this.props.localState.isSession && this.props.script.scripts.length==0) ? <InstructionUi
                            instruction={new Instruction("Es liegen keine Sessions vor", "")}

                        /> :
                            <InstructionUi
                                hasNext={this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1] ? true : false}
                                hasPrevious={this.props.assistent.phase.pointer > 0 ? true : false}
                                instruction={this.props.assistent.actInstruction}
                                nextInstruction={this.nextInstruction.bind(this)}
                                previousInstruction={this.previousInstruction.bind(this)}
                            /> :

                        <InstructionUi
                            instruction={new Instruction("Ich habe dir im Moment nichts zu sagen.", "")}
                        />

                }




            </div>
        )
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    assistent: state.assistent,
    rooms: state.rooms,
    localState: state.localState,
    script: state.script

});

export default connect(
    mapStateToProps, { PhaseController, setSharedDocEditing, setPhase, getScriptById, nextInstruction, previousInstruction, setActInstruction, setIncominginstruction }
)(withRouter(Assistent));


