// component that creates annotations
// can be requested by window.annotationEvents

import React, { Component } from "react";
import {
  SET_ANNOTATION,
  SET_ANNOTATION_CURRENT_PLAYTIME,
  REMOVE_ANNOTATION,
  MOVE_ANNOTATION
} from "./annotationEvents";
import { connect } from "react-redux";
import {
  sendSharedAnnotation,
  ownSocketId,
  removeSharedAnnotation
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
  }

  // todo: move this to backend?
  onAnnotationMoveRequest(fromPlayTime, toPlayTime) {
    try {
      const oldMeta = this.props.rooms.rooms[this.props.roomId].state
        .sharedRoomData.annotations[fromPlayTime];

      if (!oldMeta) return;

      sendSharedAnnotation(this.props.roomId, toPlayTime.toString(), oldMeta);
      removeSharedAnnotation(this.props.roomId, fromPlayTime.toString());
    } catch (e) {
      return;
    }
  }

  onAnnotationRemoveRequest(playTime) {
    removeSharedAnnotation(this.props.roomId, playTime.toString());
  }

  onAnnotationAddRequest(playTime, meta) {
    // add creator & type data
    meta.type = this.props.settings.annotationType;
    meta.creator = { nick: this.props.ownNick, color: this.props.ownColor };

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
