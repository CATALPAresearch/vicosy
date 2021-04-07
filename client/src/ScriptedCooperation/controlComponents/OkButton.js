import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import HintArrow from "./../../components/Assistent/HintArrow";
import { connect } from "react-redux";


export class OkButton extends Component {
    render() {
        return (
            <div>
                <button style={this.props.divStyle} id="toggle-switch"
                    onClick={this.props.onButtonClick}
                    className="btn primaryCol btn-sm"
                >
                    Finish Phase
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
                            style={{ position: "absolute", marginTop: 20, marginLeft: -60, zIndex: 1000 }}
                            direction="up"
                        /> : null : null}
            </div>
        );
    }
}


const mapStateToProps = state => ({

    assistent: state.assistent
});

export default connect(
    mapStateToProps
)(OkButton);


