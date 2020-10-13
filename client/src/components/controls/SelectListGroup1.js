import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class SelectListGroup1 extends Component {
  render() {

   
    function optionSelected(v1, v2) {
      if (v1 == v2)
        return "true";
      else
        return "false";
    }
    const id = this.props.id;
    const errors = this.props.errors;
    const info = this.props.info;
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;
    const selectOptions = this.props.options.map(option => (
      <option key={option.label} value={option.value} selected={valueProvider[id] == option.value}
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
          onChange={onChangeCallBack}
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
  value: PropTypes.oneOf(['STUDENT', 'TRAINER']).isRequired,
  errors: PropTypes.string,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};
