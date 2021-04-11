import React, { Component } from "react";
import ToggleSwitch from "./Switch/ToggleSwitch";
import PropTypes from "prop-types";
import classnames from "classnames";
import HintArrow from "../Assistent/HintArrow";
import { connect } from "react-redux";


export  class ToggleSwitchButton extends Component {
  render() {
    return (
      <div>
        <button
         title="Leite hier die nächste Phase ein" 
          disabled={this.props.isDisabled}
          onClick={this.props.onToggle}
          className={classnames("btn btn-sm hFlexLayout", {
            "btn-success": this.props.isChecked,
            "btn primaryCol": !this.props.isChecked
          })}
        >
          <span className="mr-1">{this.props.label}</span>{" "}
          <ToggleSwitch checked={this.props.isChecked} readonly={true} />
          {this.props.extraContent ? this.props.extraContent : null}
        </button>
        {this.props.assistent.actInstruction?this.props.assistent.active && (this.props.assistent.actInstruction.markers === "ok-understand" || this.props.assistent.actInstruction.markers === "ready-to-finish") ?
                <HintArrow
                  style={{ position: "absolute", marginTop: 10, marginLeft: 60, zIndex: 1000 }}
                  direction="up"
                /> : null:null}
              {this.props.assistent.incomingInstruction ?
                this.props.assistent.incomingInstruction.markers === "toggle-switch" ?
                  <HintArrow
                    style={{ position: "absolute", marginTop: 10, marginLeft: 60, zIndex: 1000 }}
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
)(ToggleSwitchButton);



ToggleSwitchButton.defaultProps = {
  isDisabled: false
};

ToggleSwitchButton.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  extraContent: PropTypes.object
};
