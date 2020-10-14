import React, { Component } from "react";

import classnames from "classnames";
import PropTypes from "prop-types";

class InputGroupWithButton extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: true };
    this.value = "";
    this.changeDisabled = this.changeDisabled.bind(this);
  }

  changeDisabled() {
    this.setState({ disabled: !this.state.disabled });
    if (!this.state.disabled)
      this.setState({ value: "" });
  }
  render() {
    const name = this.props.name;
    const placeholder = this.props.placeholder;
    const value = this.props.value;
    const error = this.props.error;
    const icon = this.props.icon;
    const type = this.props.type;
    const onChange = this.props.onChange

    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input type="checkbox" aria-label="Checkbox for following text input"
              onChange={this.changeDisabled}
            />
          </div>
        </div>
        <input
          className={classnames("form-control form-control-lg", {
            "is-invalid": error
          })}
          placeholder={placeholder}
          name={name}
          value={this.state.value}
          onChange={onChange}
          disabled={this.state.disabled}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  };

}
InputGroupWithButton.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

InputGroupWithButton.defaultProps = {
  type: "text"
};

export default InputGroupWithButton;
