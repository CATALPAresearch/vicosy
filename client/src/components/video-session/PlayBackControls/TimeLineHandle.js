import React, { Component } from "react";
import "./slider.css";
import classnames from "classnames";

export default class TimeLineHandle extends Component {
  render() {
    const syncHandle = (
      <div
        style={{ left: `${this.props.offset}%` }}
        className={classnames("basic-timeline-handle sync-timeline-handle", {
          "basic-timeline-handle-disabled": this.props.disabled
        })}
      >
        {<i className="group-timeline-handle-image fa fa-users" />}
      </div>
    );

    const asyncHandle = (
      <div
        style={{ left: `${this.props.offset}%` }}
        className="basic-timeline-handle async-timeline-handle"
      />
    );

    return this.props.isSyncSpace ? syncHandle : asyncHandle;
  }
}
