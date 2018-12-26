import React, { Component } from "react";
import classnames from "classnames";

export default class ValidatedInput extends Component {
  render() {
    const id = this.props.id;
    const errors = this.props.errors;
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;

    // optional
    const type = this.props.type;
    const hintText = this.props.hintText;
    const placeHolder = this.props.placeHolder;

    return (
      <div className="form-group">
        <input
          type={type}
          className={classnames("form-control form-control-lg", {
            "is-invalid": errors[id]
          })}
          placeholder={placeHolder ? placeHolder : id}
          name={id}
          value={valueProvider[id]}
          onChange={onChangeCallBack}
        />
        {hintText && (
          <small className="form-text text-muted"> {hintText} </small>
        )}
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
