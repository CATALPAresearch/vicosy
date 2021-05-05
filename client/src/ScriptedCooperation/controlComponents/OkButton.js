import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import HintArrow from "./../../components/Assistent/HintArrow";
import { setIncominginstruction } from "../../actions/assistentActions";
import Instruction from "../../components/Assistent/phases/Instruction";
import { connect } from "react-redux";


export class OkButton extends Component {
    render() {
        return (
            <div>
                <button style={this.props.divStyle} id="toggle-switch"
                    onClick={
                        (e) => {
                            if (this.props.assistent.phase.name == "SEPARATESECTIONSTUTORPRE" && !this.props.rooms.rooms[this.props.script["session_id"]].state.sharedRoomData.annotations) {
                                this.props.setIncominginstruction(new Instruction("Du hast erst weiter, wenn Kapitel gesetzt hast.", "open-annotations"));
                            }
                            else
                                this.props.onButtonClick(e);
                        }

                    }
                    className="btn primaryCol btn-sm"
                >
                    Phase beenden
          <i className="ml-1 fa fa-check-circle" />
                </button>
                {this.props.assistent.actInstruction ? this.props.assistent.active && (this.props.assistent.actInstruction.markers === "ok-understand" || this.props.assistent.actInstruction.markers === "ready-to-finish") ?
                    <HintArrow
                        style={{ position: "absolute", marginTop: 20, marginLeft: -60, zIndex: 1000 }}
                        direction="up"
                    /> : null : null}
                {this.props.assistent.incomingInstruction ?
                    this.props.assistent.incomingInstruction.markers === "toggle-switch" ?
                        <HintArrow
                            style={{ position: "absolute", marginTop: 20, marginLeft: -60, zIndex: 100 }}
                            direction="up"
                        /> : null : null}
            </div>
        );
    }
}


const mapStateToProps = state => ({

    assistent: state.assistent,
    localState: state.localState,
    script: state.script,
    rooms: state.rooms
});

export default connect(
    mapStateToProps, { setIncominginstruction }
)(OkButton);


