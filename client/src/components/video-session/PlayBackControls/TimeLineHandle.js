import React, { Component } from "react";
import "./slider.css";
import classnames from "classnames";
import { connect } from "react-redux";
import HintArrow from '../../Assistent/HintArrow'

export class TimeLineHandle extends Component {
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
      <div id="asynch-timeline-handle"
        style={{ left: `${this.props.offset}%` }}
        className="basic-timeline-handle async-timeline-handle"
      >
        {this.props.assistent.actInstruction ? this.props.assistent.active && this.props.assistent.actInstruction.markers === "asynch-timeline-handle" ?
          <HintArrow
            style={{ position: "absolute", left: -12, bottom: 26 }}
            direction="down"
          /> : null : null}

      </div>

    );

    return this.props.isSyncSpace ? syncHandle : asyncHandle;
  }
}


const mapStateToProps = state => ({
  assistent: state.assistent
});

export default connect(
  mapStateToProps
)(TimeLineHandle);