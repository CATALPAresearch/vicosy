import React, { Component } from "react";
import PropTypes from "prop-types";
import { SEEK_REQUEST } from "../../../../components/video-session/PlayBackUiEvents";
import "./cues.css";
import classnames from "classnames";

export default class PresenceCue extends Component {
  onClick() {
    window.sessionEvents.dispatch(SEEK_REQUEST, this.props.positionAbs);
  }

  render() {
    return (
      <span
        onClick={this.onClick.bind(this)}
        className="presence-cue"
        style={{ left: this.props.positionRel }}
      >
        <i
          className={classnames("fa", {
            "fa-user": !this.props.meta.isGroup,
            "fa-users": this.props.meta.isGroup
          })}
          title={this.props.meta.nick}
          style={{ color: this.props.meta.color }}
        />
      </span>
    );
  }
}

PresenceCue.propTypes = {
  positionRel: PropTypes.string.isRequired,
  positionAbs: PropTypes.number.isRequired
};
