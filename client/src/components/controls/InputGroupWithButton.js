import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class InputGroupWithButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
    };
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
    const callback = this.props.onChange;
    const error = this.props.error;
    const idCheckbox = this.props.idCheckbox;
    const idTextfield = this.props.idTextfield;
    const icon = this.props.icon;
    const value = this.props.value;
    const type = this.props.type;


    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input name={this.idCheckbox} id={this.idCheckbox} type="checkbox" aria-label="Checkbox for following text input"
              onChange={() => {this.changeDisabled(), callback }}
            />
          </div>
        </div>
        <input id={this.idTextfield}
          className={classnames("form-control form-control-lg", {
            "is-invalid": error
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={callback}
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
  value: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

InputGroupWithButton.defaultProps = {
  type: "text"
};

// export default InputGroupWithButton;

/*
const mapStateToProps = state => ({
  value: state.value
});

export default connect(
  mapStateToProps
)(InputGroupWithButton);

*/