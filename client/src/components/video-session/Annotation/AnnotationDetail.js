import React, { Component } from "react";
import "./annotation.css";
import {
  SET_ANNOTATION,
  REMOVE_ANNOTATION,
  MOVE_ANNOTATION
} from "../../logic-controls/annotationEvents";
import {
  deActivateAnnotationEditing,
  activateAnnotationEditing
} from "../../../actions/localStateActions";
import { connect } from "react-redux";
import classnames from "classnames";
import { TIME_UPDATE } from "../AbstractVideoEvents";
import { SEEK_REQUEST } from "../PlayBackUiEvents";
import connectUIState from "../../../highOrderComponents/UIStateConsumer";
import { formatTime } from "../../../helpers/formatHelper";

// Annotation Viewer / Editor
class AnnotationDetail extends Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();

    this.state = {
      title: "",
      content: "",
      type: "annotation",
      visible: false,
      timestamp: 0,
      frameSynced: true,
      isNew: false,
      playTimeHasAnnotation: false
    };

    this.preventContentChange = false;

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);

  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    window.annotationEvents.dispatch(SET_ANNOTATION, this.state.timestamp, {
      title: this.state.title,
      text: this.state.content,
      type: this.state.type
    });

    this.props.deActivateAnnotationEditing();
  }

  onRemoveClick(event) {
    this.props.deActivateAnnotationEditing();
    window.annotationEvents.dispatch(REMOVE_ANNOTATION, this.state.timestamp);
  }

  onJumpClick() {
    window.sessionEvents.dispatch(SEEK_REQUEST, this.state.timestamp);
  }

  onMoveClick() {
    const currentPlayTime = this.props.playerRef.current.getCurrentTime();

    if (this.state.isNew) {
      this.preventContentChange = true;
      this.props.activateAnnotationEditing(currentPlayTime);
    } else if (this.state.timestamp !== -1) {
      window.annotationEvents.dispatch(
        MOVE_ANNOTATION,
        this.state.timestamp,
        currentPlayTime
      );

      this.props.deActivateAnnotationEditing();
    }
  }

  isCurrentFrame() {
    const { annotationEditing } = this.props.localState;
    const currentPlayerTime = this.props.playerRef.current.getCurrentTime();
    return (
      annotationEditing !== null &&
      annotationEditing.playTime === currentPlayerTime
    );
  }

  componentDidMount() {
    window.sessionEvents.add(TIME_UPDATE, this.onVideoTimeUpdate);
  }

  componentWillUnmount() {
    if (window.sessionEvents)
      window.sessionEvents.remove(TIME_UPDATE, this.onVideoTimeUpdate);

    this.props.deActivateAnnotationEditing();
  }

  onVideoTimeUpdate() {
    if (!this.state.visible) return;

    const isSynched = this.isCurrentFrame();
    if (!isSynched && this.state.frameSynced)
      this.setState({ frameSynced: false });
    else if (isSynched && !this.state.frameSynced)
      this.setState({ frameSynced: true });
  }

  componentWillReceiveProps(nextProps) {
    this.updateByState(nextProps);
  }

  updateByState(props) {
    const wasVisible = this.state.visible;
    const prevTimeStamp = this.state.timestamp;

    // editing timestamp
    const timestamp = props.localState.annotationEditing
      ? props.localState.annotationEditing.playTime
      : -1;

    const isVisible =
      !!props.localState.annotationEditing && props.isVideoVisible;

    const currentPlayTime = this.props.playerRef.current.getCurrentTime();
    const frameSynced = timestamp === currentPlayTime;

    var availableAnnotationData = null;
    var currentPlaytimeAnnotationData = null;

    try {
      availableAnnotationData = this.props.rooms.rooms[this.props.roomId].state
        .sharedRoomData.annotations[timestamp];
    } catch (err) { }

    if (frameSynced) {
      currentPlaytimeAnnotationData = availableAnnotationData;
    } else {
      try {
        currentPlaytimeAnnotationData = this.props.rooms.rooms[
          this.props.roomId
        ].state.sharedRoomData.annotations[currentPlayTime];
      } catch (err) { }
    }

    var newStateData = {
      visible: isVisible,
      timestamp,
      isNew: !availableAnnotationData,
      frameSynced,
      playTimeHasAnnotation: !!currentPlaytimeAnnotationData
    };

    // only change text on initialize
    if (isVisible && (!wasVisible || prevTimeStamp !== timestamp)) {
      // only update contents if we are not moving the annotation
      if (!this.preventContentChange) {
        if (availableAnnotationData) {
          newStateData.title = availableAnnotationData.title;
          newStateData.content = availableAnnotationData.text;
          newStateData.type = availableAnnotationData.type
            ? availableAnnotationData.type
            : "annotation";
        } else {
          newStateData.title = "";
          newStateData.content = "";
          newStateData.type = this.props.settings.annotationType;
          setTimeout(() => {
            this.titleRef.current.focus();
          }, 100);
        }
      } else {
        // we are moving the annotation
        this.preventContentChange = false;
      }
    }

    this.setState(newStateData);
  }

  onCloseClick() {
    this.props.deActivateAnnotationEditing();
  }

  render() {
    var phase = this.props.rooms.rooms[this.props.roomId].state.sharedRoomData.collabScript.phaseData.phaseId;

    return (
      <div
        className={classnames("annotation-content roundedStrong", {
          "hidden-nosize": !this.state.visible
        })}
      >
        <form className="form-control form-control-lg" onSubmit={this.onSubmit}>
          <div>Annotation</div>

          <div className="form-group">
            <div className="input-group mb-2">
              <div className="input-group-prepend primaryBack">
                <div
                  className={classnames("input-group-text", {
                    "primaryBack": this.state.frameSynced,
                    "bg-warning": !this.state.frameSynced
                  })}
                  title="Indicates if the current video frame matches the annotation time."
                >
                  <i
                    className={classnames("fa", {
                      "fa-eye": this.state.frameSynced,
                      "fa-eye-slash": !this.state.frameSynced
                    })}
                  />
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                value={formatTime(this.state.timestamp)}
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <input
              autoFocus
              ref={this.titleRef}
              value={this.state.title}
              onChange={this.handleChange}
              type="text"
              name="title"
              className="form-control"
              placeholder="Title"
            />
          </div>

          <div className="form-group">
            <textarea
              value={this.state.content}
              onChange={this.handleChange}
              name="content"
              className="form-control"
              rows="3"
              placeholder="Description..."
            />
          </div>
          {this.state.isNew ? (
            <p className="text-secondary" style={{ fontSize: "small" }}>
              Tipp: Annotation <br></br>mit "@@TITLE" im Chat setzen            </p>
          ) : null}
          <button
            onClick={this.onJumpClick.bind(this)}
            type="button"
            className={classnames("btn primaryCol mb-2 mr-1 btn-sm", {
              "hidden-nosize": this.state.frameSynced
            })}
            title="Jump to this annotation"
          >
            <i className="fa fa-search" />
          </button>
          <input
            className="btn primaryCol mb-2 btn-sm"
            type="submit"
            value={this.state.isNew ? "Setzen" : "Setzen"}
            title="Speichere die Annotation"
          />

          <button
            onClick={this.onMoveClick.bind(this)}
            type="button"
            className={classnames("btn primaryCol mb-2 ml-1 btn-sm", {
              "hidden-nosize": this.state.frameSynced
            })}
            title={
              this.state.playTimeHasAnnotation
                ? "Remove current annotation first before moving selected one"
                : "Move this annotation to current playtime"
            }
            disabled={this.state.playTimeHasAnnotation}
          >
            <i className="fa fa-map-marker" />{" "}
            <i className="fa fa-arrows-alt-h" />
          </button>
          <button
            onClick={this.onRemoveClick.bind(this)}
            type="button"
            className={classnames("btn btn-warning mb-2 ml-2 btn-sm", {
              "hidden-nosize": this.state.isNew
            })}
            title="Delete this annotation from shared space"
            disabled=
            {(phase !== "PHASE_SEPARATE_SECTIONS" && this.state.type === "annotation-section")}
          >
            Entfernen
            


          </button>
        </form>
        <button
          onClick={this.onCloseClick.bind(this)}
          className="btn primaryCol btn-sm close-btn"
        >
          <i className="fa fa-times-circle" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  localState: state.localState,
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  { deActivateAnnotationEditing, activateAnnotationEditing }
)(connectUIState(AnnotationDetail));
