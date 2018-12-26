import React, { Component } from "react";
import TimeDisplay from "../../../controls/TimeDisplay";
import { SEEK_REQUEST } from "../../PlayBackUiEvents";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  activateAnnotationEditing,
  deActivateAnnotationEditing
} from "../../../../actions/localStateActions";

class AnnotationEntry extends Component {
  constructor() {
    super();

    this.onJumpClick = this.onJumpClick.bind(this);
    this.selectEntry = this.selectEntry.bind(this);
  }

  onJumpClick() {
    const { timeStamp } = this.props;
    window.sessionEvents.dispatch(SEEK_REQUEST, timeStamp);
  }

  selectEntry() {
    if (this.isSelected()) this.props.deActivateAnnotationEditing();
    else this.props.activateAnnotationEditing(this.props.timeStamp);
  }

  isSelected() {
    const { annotationEditing } = this.props.localState;
    return (
      annotationEditing !== null &&
      annotationEditing.playTime === this.props.timeStamp
    );
  }

  render() {
    const { timeStamp, data } = this.props;

    return (
      <li
        onClick={this.selectEntry}
        className={classnames(
          "annotation-overview-entry force-break list-group-item",
          {
            active: this.isSelected()
          }
        )}
      >
        <button
          onClick={this.onJumpClick}
          className="btn btn-outline-dark btn-sm"
        >
          <TimeDisplay seconds={timeStamp} />{" "}
        </button>
        <span className="ml-2 mr-2 force-break">
          {data.title ? data.title : "untitled"}
        </span>
        {/* <button onClick={this.onJumpClick} className="btn btn-primary btn-sm">
          <i className="fa fa-search" />
        </button> */}
      </li>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { activateAnnotationEditing, deActivateAnnotationEditing }
)(AnnotationEntry);
