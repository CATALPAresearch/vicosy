import React, { Component } from "react";
import PropTypes from "prop-types";
import { SEEK_REQUEST } from "../../../../components/video-session/PlayBackUiEvents";
import { connect } from "react-redux";
import {
  activateAnnotationEditing,
  deActivateAnnotationEditing
} from "../../../../actions/localStateActions";
import "./cues.css";
import classnames from "classnames";

class Cue extends Component {
  onClick() {
    this.toggleSelection(false);
  }

  onRightClick(evt) {
    evt.preventDefault();
    this.toggleSelection(true);
  }

  toggleSelection(forceJumpTo) {
    const selected = this.isSelected();
    const currentFrame = this.isCurrentFrame();
    if ((forceJumpTo || selected) && !currentFrame)
      window.sessionEvents.dispatch(SEEK_REQUEST, this.props.positionAbs);

    if (selected && currentFrame) {
      this.props.deActivateAnnotationEditing();
    } else if (!selected) {
      this.props.activateAnnotationEditing(this.props.positionAbs);
    }
  }

  isSelected() {
    const { annotationEditing } = this.props.localState;
    return (
      annotationEditing !== null &&
      annotationEditing.playTime === this.props.positionAbs
    );
  }

  isCurrentFrame() {
    return this.props.positionAbs === window.playerRef.current.getCurrentTime();
  }

  render() {
    const { meta } = this.props;

    return (
      <span
        onClick={this.onClick.bind(this)}
        onContextMenu={this.onRightClick.bind(this)}
        className={classnames("cue", {
          "cue-detailmode alpha-pulse": this.isSelected()
        })}
        style={{
          left: this.props.positionRel,
          color: meta.creator ? meta.creator.color : "white"
        }}
      >
        <i
          className={classnames("fa", {
            "fa-map-marker-alt alpha-pulse": meta.temporaryAdd,
            "fa-map-marker": !meta.temporaryAdd
          })}
          title={
            meta.temporaryAdd
              ? "New annotation"
              : `By ${meta.creator ? meta.creator.nick : "system"}: ${
                  meta.text
                }`
          }
        />
      </span>
    );
  }
}

Cue.propTypes = {
  meta: PropTypes.object.isRequired,
  positionRel: PropTypes.string.isRequired,
  positionAbs: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { activateAnnotationEditing, deActivateAnnotationEditing }
)(Cue);
