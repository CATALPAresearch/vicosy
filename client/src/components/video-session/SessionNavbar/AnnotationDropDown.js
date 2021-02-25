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
    console.log(this.props.settings);
    if (this.props.settings.annotationType == "annotation-section")
      return (
        <button id="open-annotations"
        className="btn btn-primary"
        title="Defines a split/chapter point. As a result 2 new timesections will appear."
              onClick={this.onAnnotationTriggered.bind(this)}
        >
        <i className="fa fa-film" /> Create Chapter
      </button>
      );
      if (this.props.settings.annotationType == "annotation")
      return (
        <button id="annot-button"
        className="btn btn-primary"
        title="Simple annotation marking POIs in the video."
              onClick={this.onAnnotationTriggered.bind(this)}
        >
        <i className="fa map-marker" />Annotate
      </button>
      )
    
      
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
