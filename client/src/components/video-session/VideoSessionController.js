import React, { Component } from "react";
import PropTypes from "prop-types";
import { PLAYER_API_INITIALIZED } from "../video-session/AbstractVideoEvents";
import {
  PLAY_REQUEST,
  PAUSE_REQUEST,
  SEEK_REQUEST
} from "../video-session/PlayBackUiEvents";
import HardSyncController from "./PhaseControllers/HardSyncController";
import AsyncController from "./PhaseControllers/AsyncController";
import { connect } from "react-redux";
import { setSyncState } from "../../actions/localStateActions";
import DialogController from "./PhaseControllers/DialogController";
import RoomComponent from "../controls/RoomComponent";
import ActivityOberserver from "./Activities/activity-observer";

// component that controls session and speaks with AbstractPlayer and Redux state
// must be used as a RoomComponent
class VideoSessionController extends Component {
  constructor(props) {
    super(props);

    this.syncControllerRef = null;
    this.asyncControllerRef = null;
    this.activeControllerRef = this.syncControllerRef;

    this.state = {
      videoUrl: "",
      playerApiInitialized: false,
      playBackUserAction: {}
    };

    this.onPlayRequest = this.onPlayRequest.bind(this);
    this.onPauseRequest = this.onPauseRequest.bind(this);
    this.onSeekRequest = this.onSeekRequest.bind(this);
    this.onPlayerApiInitialized = this.onPlayerApiInitialized.bind(this);
    this.updateRefs = this.updateRefs.bind(this);

  }

  componentDidMount() {

    this.player = this.props.playerRef.current;
    this.playback = this.props.playBackRef.current;

    this.props.sessionEvents.add(PLAY_REQUEST, this.onPlayRequest);
    this.props.sessionEvents.add(PAUSE_REQUEST, this.onPauseRequest);
    this.props.sessionEvents.add(SEEK_REQUEST, this.onSeekRequest);

    this.setState({
      playerApiInitialized: this.player.isPlayerApiInitialized()
    });
    this.props.playerRef.current.on(
      PLAYER_API_INITIALIZED,
      this.onPlayerApiInitialized
    );
console.log(this.props.roomState);
  }

  componentWillUnmount() {
    this.props.setSyncState(true);

    this.props.sessionEvents.remove(PLAY_REQUEST, this.onPlayRequest);
    this.props.sessionEvents.remove(PAUSE_REQUEST, this.onPauseRequest);
    this.props.sessionEvents.remove(SEEK_REQUEST, this.onSeekRequest);

    if (this.props.playerRef.current) {
      this.props.playerRef.current.off(
        PLAYER_API_INITIALIZED,
        this.onPlayerApiInitialized
      );
    }
  }

  /**
   * Local players playback events
   */

  onPlayRequest() {
    if (this.activeControllerRef) this.activeControllerRef.onPlayRequest();
  }

  onPauseRequest() {
    if (this.activeControllerRef) this.activeControllerRef.onPauseRequest();
  }

  onSeekRequest(targetTime) {
    // todo: handle sync/async
    if (this.activeControllerRef) {
      this.activeControllerRef.onSeekRequest(targetTime);
    }
    // this.player.pause(targetTime);
  }

  onPlayerApiInitialized() {
    console.log("PLAYER API INITIALIZED");

    this.setState({ playerApiInitialized: true });
  }

  componentWillReceiveProps(nextProps) {

    const { roomAvailable, roomData } = nextProps.roomState;

    if (roomAvailable && roomData.state.sharedRoomData.meta) {
      var { videoUrl } = roomData.state.sharedRoomData.meta;

      // TODO: used to display a different video inside the session. e.g. a tutorial
      // video for peer teaching
      if (roomData.state.sharedRoomData["overrideVideoUrl"])
        videoUrl = roomData.state.sharedRoomData.overrideVideoUrl;

      if (this.state.videoUrl !== videoUrl) {
        this.setState({ videoUrl: videoUrl, playerApiInitialized: false });
        this.props.playerRef.current.setVideoUrl(videoUrl);
      }
    }

    this.updateRefs(nextProps);
  }

  updateRefs(props) {
    const isSynced = props.localState.syncState.sync;
    if (isSynced && this.activeControllerRef !== this.syncControllerRef) {
      this.activeControllerRef = this.syncControllerRef;
    } else if (
      !isSynced &&
      this.activeControllerRef !== this.asyncControllerRef
    ) {
      this.activeControllerRef = this.asyncControllerRef;
    }
  }

  updateAsyncRef(ref) {
    this.asyncControllerRef = ref;
    this.updateRefs(this.props);
  }

  updateSyncRef(ref) {
    this.syncControllerRef = ref;
    this.updateRefs(this.props);
  }

  // sync state => exchange controllers
  render() {

    const contentPlayerApiInitialized = (
      <span>
        <HardSyncController
          onRef={this.updateSyncRef.bind(this)}
          playerRef={this.props.playerRef}
          playBackRef={this.props.playBackRef}
          roomState={this.props.roomState}
          roomId={this.props.roomId}
          active={this.props.localState.syncState.sync}
        />

        <AsyncController
          onRef={this.updateAsyncRef.bind(this)}
          playerRef={this.props.playerRef}
          playBackRef={this.props.playBackRef}
          roomState={this.props.roomState}
          roomId={this.props.roomId}
          active={!this.props.localState.syncState.sync}
        />

        <DialogController />

        <RoomComponent
          roomId={this.props.roomId}
          component={ActivityOberserver}

        />


      </span>
    );

    const targetContent = this.state.playerApiInitialized
      ? contentPlayerApiInitialized
      : null;

    return <div>{targetContent}</div>;
  }
}

VideoSessionController.propTypes = {
  playerRef: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  localState: state.localState,
  auth: state.auth,
  script: state.script
});

export default connect(
  mapStateToProps,
  { setSyncState }
)(VideoSessionController);
