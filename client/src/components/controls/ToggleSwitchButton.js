import React, { Component } from "react";
import ToggleSwitch from "./Switch/ToggleSwitch";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ToggleSwitchButton extends Component {
  render() {
    return (
      <div>
        <button
         title="Leite ihr die nächste Phase ein" 
          disabled={this.props.isDisabled}
          onClick={this.props.onToggle}
          className={classnames("btn btn-sm hFlexLayout", {
            "btn-success": this.props.isChecked,
            "btn-danger": !this.props.isChecked
          })}
        >
          <span className="mr-1">{this.props.label}</span>{" "}
          <ToggleSwitch checked={this.props.isChecked} readonly={true} />
          {this.props.extraContent ? this.props.extraContent : null}
        </button>
      </div>
    );
  }
}

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
