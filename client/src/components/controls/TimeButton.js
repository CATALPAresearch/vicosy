import React, { Component } from "react";
import connectUIState from "../../highOrderComponents/UIStateConsumer";
import { SEEK_REQUEST } from "../video-session/PlayBackUiEvents";
import PropTypes from "prop-types";
import TimeDisplay from "./TimeDisplay";

class TimeButton extends Component {
  onTimeActionClick = e => {
    e.stopPropagation();
    console.log("jump to", this.props.secs);
    window.sessionEvents.dispatch(SEEK_REQUEST, this.props.secs);
  };

  render() {
    const { isVideoVisible } = this.props;

    return (
      <button
        onClick={this.onTimeActionClick}
        disabled={isVideoVisible ? "" : "disabled"}
        type="button"
        className="btn btn-outline-dark btn-sm"
      >
        {!this.props.faIcon ? null : (
          <i
            className={`fa mr-1 ${this.props.faIcon}`}
            style={{ color: "#007bff" }}
          />
        )}

        <TimeDisplay seconds={this.props.secs} />
      </button>
    );
  }
}

TimeButton.propTypes = {
  secs: PropTypes.number.isRequired,
  faIcon: PropTypes.string
};

export default connectUIState(TimeButton);
