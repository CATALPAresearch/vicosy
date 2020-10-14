import React, { Component } from "react";

export default class CheckBox extends Component {
  render() {
    return (

      <input
        type="checkbox"
        name={this.props.name}
        id={this.props.name}
        checked={this.props.checked}
        readOnly={this.props.readonly}
        onChange={this.props.onChange}
      />

    );
  }
}

CheckBox.defaultProps = {
  readonly: false
};
