import PropTypes from "prop-types";
import React, { Component } from "react";
import { formatTime } from "../../helpers/formatHelper";

export default class TimeDisplay extends Component {
  render() {
    return (
      <span className="time-display no-break">
        {formatTime(this.props.seconds)}
      </span>
    );
  }
}

TimeDisplay.propTypes = {
  seconds: PropTypes.number.isRequired
};
