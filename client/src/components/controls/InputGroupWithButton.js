import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class InputGroupWithButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      value: ""
    };

    this.changeDisabled = this.changeDisabled.bind(this);

  }

  changeDisabled() {
    this.setState({ disabled: !this.state.disabled });
    if (!this.state.disabled) {
      this.setState({ value: '' })
    }

  }
  updateMessage = (message) => {
    this.setState(() => ({
      value: message
    }));
  }
  render() {
    const name = this.props.name;
    const placeholder = this.props.placeholder;
    const onChangeCallBack = this.props.onChange;
    const onCheckboxChangeCallback = this.props.onCheckboxChange
    const error = this.props.error;
    const idCheckbox = this.props.idCheckbox;
    const idTextfield = this.props.idTextfield;
    const icon = this.props.icon;
    const type = this.props.type;
    const readOnly = this.props.readOnly;


    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input name={idTextfield} id={idCheckbox} disabled={readOnly} value="checkbox" checked={!this.props.disabled} type="checkbox" aria-label="Checkbox for following text input"
              onChange={(e) => { this.changeDisabled(), onCheckboxChangeCallback(e) }}
            />
          </div>
        </div>
        <input id={idTextfield}
          className={classnames("form-control form-control-lg", {
            "is-invalid": error
          })}
          placeholder={placeholder}
          name={name}
          value={this.props.value}
          onChange={(e) => { this.updateMessage(e.target.value), onChangeCallBack(e) }}
          disabled={this.props.disabled || readOnly}
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