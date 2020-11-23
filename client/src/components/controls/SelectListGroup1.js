import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class SelectListGroup1 extends Component {
  render() {
    console.log(this.props);
    const id = this.props.id;
    const errors = this.props.errors;
    const info = this.props.info;
    const onChangeCallBack = this.props.onChange;
    const readOnly=this.props.readOnly;
    const valueProvider = this.props.valueProvider;
    const selectOptions = this.props.options.map(option => (
      <option key={option.label} value={option.value} selected={valueProvider[id] == option.value ? true : false}
      >
        {option.label}
      </option>
    ));

    return (
      <div className="form-group">
        <select
          className={classnames("form-control form-control-lg", {
            "is-invalid": errors[id]
          })}
          name={id}
          id={id}
          onChange={onChangeCallBack}
          disabled={readOnly}
        >
          {selectOptions}
        </select>
        {info && <small className="form-text text-muted">{info}</small>}
        {errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
      </div>
    );
  };

}
SelectListGroup1.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  errors: PropTypes.object,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

