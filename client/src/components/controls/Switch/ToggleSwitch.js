import React, { Component } from "react";
import "./switch.css";
import classnames from "classnames";

export default class ToggleSwitch extends Component {
  render() {
    return (
      <label
        className={classnames("switch", {
          "prevent-pointer": this.props.readonly
        })}
      >
        <input
          type="checkbox"
          checked={this.props.checked}
          readOnly={this.props.readonly}
        />
        <span className="slider round" />
      </label>
    );
  }
}

ToggleSwitch.defaultProps = {
  checked: false,
  readonly: false
};
