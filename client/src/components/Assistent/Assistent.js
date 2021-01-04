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
import Arrow from 'react-arrow';


class Assistent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            left: 0, top: 0
        };
        this.assistentControlRef = null;
        // window.onresize = this.setArrowPosition;
        window.addEventListener('resize', this.updateArrowPosition.bind(this));


    }
    setArrowPosition() {
        let element = document.getElementById("chat-write").getBoundingClientRect();
        this.setState({ left: element.left - 90, top: element.top - 60 });
    }

    updateArrowPosition() {
        let element = document.getElementById("chat-write").getBoundingClientRect();
        this.setState({ left: element.left - 90, top: element.top +25 });
    }


    componentDidMount() {
        this.setArrowPosition();
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


                <Arrow
                    direction="right"
                    shaftWidth={15}
                    shaftLength={40}
                    headWidth={40}
                    headLength={30}
                    fill="red"
                    text="Chat"
                    stroke="red"
                    strokeWidth={2}
                    style={{ position: "absolute", left: this.state.left, top: this.state.top }}
                />


                {/*
                <Xarrow
                    start="startarrow" //can be react ref
                    end="chat-write" //or an id
                    curveness={0}
                    color="red"
                    strokeWidth={10}
                    headSize={8}
                    z-index="999"
                />

*/}
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


