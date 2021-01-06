import React, { Component } from "react";
import classnames from "classnames";
import { setAnnotationType } from "../../../actions/settingActions";
import {
  activateAnnotationEditing,
  deActivateAnnotationEditing
} from "../../../actions/localStateActions";
import { connect } from "react-redux";
import { PAUSE_REQUEST } from "../PlayBackUiEvents";

class AnnotationDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAnnotationType: "annotation"
    };
  }

  onAnnotationTriggered() {
    // window.genericAppEvents.dispatch(action);

    if (this.isCurrentFrame()) {
      this.props.deActivateAnnotationEditing();
    } else {
      const playime = this.props.playerRef.current.getCurrentTime();
      window.sessionEvents.dispatch(PAUSE_REQUEST, playime);
      this.props.activateAnnotationEditing(playime);
    }
  }

  onAnnotationTypeChange(type) {
    this.props.setAnnotationType(type);
  }

  componentWillMount() {
    this.updateBySettings(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateBySettings(nextProps);
  }

  updateBySettings(props) {
    if (props.settings) {
      this.setState({ selectedAnnotationType: props.settings.annotationType });
    }
  }

  isCurrentFrame() {
    const { annotationEditing } = this.props.localState;
    return (
      annotationEditing !== null &&
      annotationEditing.playTime ===
        this.props.playerRef.current.getCurrentTime()
    );
  }

  render() {
    return (
      <div className="btn-group">
        <div className="btn-group dropleft" role="group">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle dropdown-toggle-split  btn-sm"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle Dropleft</span>
          </button>
          <div className="dropdown-menu">
            <a
              className={classnames("dropdown-item", {
                active: this.state.selectedAnnotationType === "annotation"
              })}
              title="Simple annotation marking POIs in the video."
              onClick={this.onAnnotationTypeChange.bind(
                this,
                "annotation",
                false
              )}
              href="#"
            >
              <i className="fa fa-map-marker" /> Annotation
            </a>
            <a
              className={classnames("dropdown-item", {
                active:
                  this.state.selectedAnnotationType === "annotation-section"
              })}
              title="Defines a split/chapter point. As a result 2 new timesections will appear."
              onClick={this.onAnnotationTypeChange.bind(
                this,
                "annotation-section",
                false
              )}
              href="#"
            >
              <i className="fa fa-map-signs" /> Chapter Annotation
            </a>
          </div>
        </div>
        <button id="open-annotations"
          onClick={this.onAnnotationTriggered.bind(this)}
          className="btn btn-secondary btn-sm"
          title="Open annotation editor for the current video frame"
        >
          Annotate{" "}
          <i
            className={classnames("fa", {
              "fa-map-signs":
                this.state.selectedAnnotationType === "annotation-section",
              "fa-map-marker":
                this.state.selectedAnnotationType === "annotation"
            })}
          />
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setAnnotationType, activateAnnotationEditing, deActivateAnnotationEditing }
)(AnnotationDropDown);
