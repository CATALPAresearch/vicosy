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
            arrows: ""
        };
        this.assistentControlRef = null;
        // window.onresize = this.setArrowPosition;
        window.addEventListener('resize', this.updateArrowPosition.bind(this));


    }
    setArrowPosition() {
        if (this.props.assistent.actInstruction.markers)
            if (this.props.assistent.actInstruction.markers.length > 0)
                this.props.assistent.actInstruction.markers.map(arrow => {
                    let element = document.getElementById(arrow).getBoundingClientRect();
                    let position = [];
                    let left;
                    let top;
                    position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });
                    this.setState({ arrows: position });
                });
    }

    updateArrowPosition() {
        if (this.props.assistent.actInstruction.markers)
            if (this.props.assistent.actInstruction.markers.length > 0)
                this.props.assistent.actInstruction.markers.map(arrow => {
                    let element = document.getElementById(arrow).getBoundingClientRect();
                    let position = [];
                    let left;
                    let top;
                    position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });
                    this.setState({ arrows: position });
                });
    }


    componentDidMount() {
        this.setArrowPosition();
    }
    nextInstruction() {
        if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer + 1]) {
            this.props.nextInstruction();
            this.updateArrowPosition();
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

        var key = 0;
        if (this.props.assistent.actInstruction.markers)
            var arrows = this.props.assistent.actInstruction.markers.map(arrow => {
                key++;
                var element = document.getElementById(arrow).getBoundingClientRect();
                let position = [];
                var left = element.left + window.pageXOffset - 80;

                var halfheight = Math.round(parseFloat(((element.top - element.bottom) / 2)));
                
                var top = element.top + window.pageYOffset -50 + halfheight;
                //position[{ arrow }] = ({ left: element.left + window.pageXOffset - 80, top: element.top + window.pageYOffset - 55 });
                return (
                    <Arrow className="arrow"
                        key={arrow}
                        id={arrow}
                        direction="right"
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
            )

        return (

            <div id="assistent">


                {arrows};

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


