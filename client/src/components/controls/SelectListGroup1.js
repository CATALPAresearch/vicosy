import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class SelectListGroup1 extends Component { 
  render() {
    const id = this.props.id;
    const errors = this.props.errors;
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;
    const name= this.props.name;
    const error = this.props.error;
    const info = this.props.info
    const onChangeCallBack = this.props.onChange;
    const valueProvider = this.props.valueProvider;
    {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <div className="form-group">
      <select
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        name={name}
        value={value}
        onChange={onChange}
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
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};
