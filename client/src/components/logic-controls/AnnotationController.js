// component that creates annotations
// can be requested by window.annotationEvents

import React, { Component } from "react";
import {
  SET_ANNOTATION,
  SET_ANNOTATION_CURRENT_PLAYTIME,
  REMOVE_ANNOTATION,
  MOVE_ANNOTATION,
  FETCH_ANNOTATIONS
} from "./annotationEvents";
import { connect } from "react-redux";
import {
  sendSharedAnnotation,
  ownSocketId,
  removeSharedAnnotation,
  fetchAnnotations
} from "../../socket-handlers/api";
import connectUserData from "../../highOrderComponents/OwnUserDataConsumer";

class AnnotationController extends Component {
  constructor(props) {
    super(props);

    this.onAnnotationAddRequest = this.onAnnotationAddRequest.bind(this);
    this.onAnnotationCurrentAddRequest = this.onAnnotationCurrentAddRequest.bind(
      this
    );
    this.onAnnotationRemoveRequest = this.onAnnotationRemoveRequest.bind(this);
    this.onAnnotationMoveRequest = this.onAnnotationMoveRequest.bind(this);
    this.onAnnotationFetchRequest = this.onAnnotationFetchRequest.bind(this);
  }

  componentDidMount() {
    window.annotationEvents.add(SET_ANNOTATION, this.onAnnotationAddRequest);
    window.annotationEvents.add(
      REMOVE_ANNOTATION,
      this.onAnnotationRemoveRequest
    );
    window.annotationEvents.add(
      SET_ANNOTATION_CURRENT_PLAYTIME,
      this.onAnnotationCurrentAddRequest
    );
    window.annotationEvents.add(MOVE_ANNOTATION, this.onAnnotationMoveRequest);
    window.annotationEvents.add(
      FETCH_ANNOTATIONS,
      this.onAnnotationFetchRequest
    );
  }

  componentWillUnmount() {
    window.annotationEvents.remove(SET_ANNOTATION, this.onAnnotationAddRequest);
    window.annotationEvents.remove(
      REMOVE_ANNOTATION,
      this.onAnnotationRemoveRequest
    );
    window.annotationEvents.remove(
      SET_ANNOTATION_CURRENT_PLAYTIME,
      this.onAnnotationCurrentAddRequest
    );
    window.annotationEvents.remove(
      MOVE_ANNOTATION,
      this.onAnnotationMoveRequest
    );
    window.annotationEvents.remove(
      FETCH_ANNOTATIONS,
      this.onAnnotationFetchRequest
    );
  }

  onAnnotationFetchRequest() {
    fetchAnnotations(this.props.roomId);
  }

  // todo: move this to backend?
  onAnnotationMoveRequest(fromPlayTime, toPlayTime) {
    try {
      const oldMeta = this.props.rooms.rooms[this.props.roomId].state
        .sharedRoomData.annotations[fromPlayTime];

      if (!oldMeta) return;

      sendSharedAnnotation(this.props.roomId, toPlayTime.toString(), oldMeta);
      setTimeout(() => {
        removeSharedAnnotation(this.props.roomId, fromPlayTime.toString());
      }, 200);
    } catch (e) {
      return;
    }
  }

  onAnnotationRemoveRequest(playTime) {
    removeSharedAnnotation(this.props.roomId, playTime.toString());
  }

  onAnnotationAddRequest(playTime, meta) {
    // add creator & type data
    meta.type = meta.type ? meta.type : this.props.settings.annotationType;

    meta.creator = { nick: this.props.ownNick, color: "white" };

    sendSharedAnnotation(this.props.roomId, playTime.toString(), meta);
  }

  onAnnotationCurrentAddRequest(meta) {
    // extract current playtime of player
    const playTime = this.props.playerRef.current.getCurrentTime();
    this.onAnnotationAddRequest(playTime, meta);
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  settings: state.settings,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(connectUserData(AnnotationController));
