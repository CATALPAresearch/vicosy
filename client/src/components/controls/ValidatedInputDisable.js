import React, { Component } from "react";
import classnames from "classnames";

export default class ValidatedInput extends Component {
  render() {
    const id = this.props.id;
    const errors = this.props.errors;
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;
    const value = this.props.value;
    const readOnly = this.props.readOnly;

    // optional
    const type = this.props.type;
    const hintText = this.props.hintText;
    const placeHolder = this.props.placeHolder;

    return (
      <div>
      <input
        id={id}

        type="text"
        className={classnames("form-control form-control-lg", {
          "is-invalid": errors[id]
        })}
        readOnly={readOnly}
        placeholder={errors[id] ? errors[id] : placeHolder}

        value={value}
        onChange={onChangeCallBack}
      />
      <div className="invalid-feedback">{errors[id]}</div>
      </div>
    );
  }
}

ValidatedInput.defaultProps = {
  type: "text", // can also be email, password
  hintText: "",
  placeHolder: ""
};
