import React, { Component, useRef, useState } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import "./assistent.css";
import assi_on from './images/lehrer.png';
import assi_off from './images//lehrer_aus.png';
import Instruction from "./Instruction";
import IncomingInstruction from "./IncomingInstruction";
import AssistentController from "./AssistentController";
import { setIncominginstruction, setPhase, setActInstruction, nextInstruction, previousInstruction } from "../../actions/assistentActions";
import { faAllergies } from "@fortawesome/free-solid-svg-icons";
import Arrow from 'react-arrow';
import { getScriptById } from "../../actions/scriptActions";



class Assistent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            display: "none",
            arrows: ""
        };
        this.assistentControlRef = null;
        this.arrows = this.getArrowPosition();
        this.renderDepth = 0;
        // window.onresize = this.setArrowPosition;




    }


    actualize() {
        //Das müsste noch gefixed werden, aber forceUpdate geht nicht!!
        //    window.location.reload();
        this.setActInstruction();

    }





    getArrowPosition() {
        let arrows = null;
        if (this.props.assistent.actInstruction)
            if (this.props.assistent.actInstruction.markers) {
                arrows = this.props.assistent.actInstruction.markers.map(arrow => {

                    if (arrow.mode == "id") {

                        var element = document.getElementById(arrow.id).getBoundingClientRect();

                        var left = element.left + window.pageXOffset - 80 + arrow.left;

                        var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));

                        var top = element.top + window.pageYOffset - 50 + halfheight + arrow.top;
                        //position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });

                        return (
                            <Arrow className="arrow"
                                key={arrow.id}
                                id={arrow.id}
                                direction={arrow.orientation}
                                shaftWidth={15}
                                shaftLength={40}
                                headWidth={40}
                                headLength={30}
                                fill="red"
                                text="Chat"
                                stroke="red"
                                strokeWidth={2}
                                style={{ position: "absolute", left: left, top: top }}
                            />

                        );

                    }
                }
                )
            }
        return arrows;
    }


    getArrowPositionIncoming() {
        let arrows = null;
        if (this.props.assistent.incomingInstruction)
            if (this.props.assistent.incomingInstruction.markers) {
                arrows = this.props.assistent.incomingInstruction.markers.map(arrow => {

                    if (arrow.mode == "id") {

                        var element = document.getElementById(arrow.id).getBoundingClientRect();

                        var left = element.left + window.pageXOffset - 80 + arrow.left;

                        var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));

                        var top = element.top + window.pageYOffset - 50 + halfheight + arrow.top;
                        //position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });

                        return (
                            <Arrow className="arrow"
                                key={arrow.id}
                                id={arrow.id}
                                direction={arrow.orientation}
                                shaftWidth={15}
                                shaftLength={40}
                                headWidth={40}
                                headLength={30}
                                fill="red"
                                text="Chat"
                                stroke="red"
                                strokeWidth={2}
                                style={{ position: "absolute", left: left, top: top }}
                            />

                        );

                    }
                }
                )
            }
        return arrows;
    }


    nextInstruction() {

        if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1]) {
            this.arrows = null;
            this.props.setActInstruction(null);
            this.props.nextInstruction();

        }
        else return null;

    }

    previousInstruction() {
        this.arrows = null;
        if (this.props.assistent.phase.pointer > 0) {
            this.props.previousInstruction();

        }
        else return null;

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
        this.props.setActInstruction(null);
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
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.actualize.bind(this));
        document.addEventListener("keydown", this._handleKeyDown, false);
        // this.arrows = null;
        // this.getArrowPosition();
        this.actualize();
    }

    componentWillUnmount() {
        this.actualize();
        this.props.setActInstruction(null);
        this.arrows = null;
    }


    render() {
        console.log(this.props);
        {
            this.props.assistent.incomingInstruction ?
                this.arrows = this.getArrowPositionIncoming() :
                this.arrows = this.getArrowPosition()
        }
        return (
            <div id="assistent">
                {this.arrows}

                <div id="overlay" style={{ display: this.state.display }}>
                    <div id="text">
                        test
                    </div>
                </div>


                <div className="panel" id="laempel">
                    <img src={assi_on} alt="Laempel" width="100%" height="100%" />
                </div>

                <AssistentController createRef={el => (this.assistentControlRef = el)} />
                {this.props.assistent.incomingInstruction ?
                    <IncomingInstruction
                        instruction={this.props.assistent.incomingInstruction}
                        quit={this.deleteIncomingInstruction.bind(this)}
                    /> : this.props.assistent.phase ?
                        <Instruction
                            hasNext={this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1] ? true : false}
                            hasPrevious={this.props.assistent.phase.pointer > 0 ? true : false}
                            instruction={this.props.assistent.actInstruction}
                            nextInstruction={this.nextInstruction.bind(this)}
                            previousInstruction={this.previousInstruction.bind(this)}
                        /> : null}


            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    assistent: state.assistent
});

export default connect(
    mapStateToProps, { AssistentController, getScriptById, nextInstruction, previousInstruction, setActInstruction, setIncominginstruction }
)(withRouter(Assistent));


