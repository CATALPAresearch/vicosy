import PropTypes from "prop-types";
import React, { Component } from "react";

export default class TimeDisplay extends Component {
  render() {
    const date = new Date(null);
    date.setSeconds(this.props.seconds); // specify value for SECONDS here
    const timeString = date.toISOString().substr(11, 8);

    return <span className="time-display no-break">{timeString}</span>;
  }
}

TimeDisplay.propTypes = {
  seconds: PropTypes.number.isRequired
};
