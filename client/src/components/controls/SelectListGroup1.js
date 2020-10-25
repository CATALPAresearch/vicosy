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
    const error = this.props.error;
    const info = this.props.info;
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;
    const selectOptions = this.props.options.map(option => (
      <option key={option.label} value={option.value} defaultValue={valueProvider[id] == option.value}
      >
        {option.label}
      </option>
    ));

    return (
      <div className="form-group">
        <select
          className={classnames("form-control form-control-lg", {
            "is-invalid": error
          })}
          name={id}
          id={id}
          onChange={onChangeCallBack}
        >
          {selectOptions}
        </select>
        {info && <small className="form-text text-muted">{info}</small>}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  };

}
SelectListGroup1.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  errors: PropTypes.string,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

