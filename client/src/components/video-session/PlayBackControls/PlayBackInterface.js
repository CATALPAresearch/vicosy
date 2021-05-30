import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  TIME_UPDATE,
  PLAY_CHANGE,
  VOLUME_CHANGE,
  PLAYER_API_INITIALIZED
} from "../AbstractVideoEvents";
import { PLAY_REQUEST, PAUSE_REQUEST, SEEK_REQUEST } from "../PlayBackUiEvents";
import Observable from "../../../utils/observable";
import classnames from "classnames";
import TimeDisplay from "../../controls/TimeDisplay";
import "./playback-interface.css";
import CueLine from "./Annotations/CueLine";
import PresenceLine from "./Annotations/PresenceLine";
import { connect } from "react-redux";
import TimeLineHandle from "./TimeLineHandle";
import SectionLine from "./Annotations/SectionLine";
import {
  setSyncScrubPerc,
  resetSyncScrubPerc
} from "../../../actions/localStateActions";
import RemoteScrubLine from "./RemoteScrubLine";
import { getRemoteScrubClient } from "../../../helpers/rooms/roomsHelper";
import FeatureRenderer from "../../controls/FeatureRenderer";
import AnnotationDropDown from "../SessionNavbar/AnnotationDropDown";
import MarkerDropDown from "../SessionNavbar/MarkerDropDown";
import { FEATURES } from "../../../reducers/featureTypes";
import HintArrow from "../../Assistent/HintArrow";
import EvalLogger from "../Evaluation/EvalLogger";
import { PLAY_VIDEO, STOP_VIDEO } from "../Evaluation/EvalLogEvents";

const SLIDER_STEPS = 1000;

class PlayBackInterface extends Component {
  constructor(props) {
    super(props);

    this.observable = new Observable(props.sessionEvents);

    this.state = {
      scrubbing: false,
      currentExternalPerc: 0,
      currentUserPerc: 0,
      userControlled: false,
      lastMediaActionHash: "",
      videoIsPlaying: false,
      currentPlayTime: 0, // can be calculated by slider perc or set on player time update
      videoVolume: 100, // 0-100,
      videoDuration: 0,
      scrubCount: 0,
      showDuration: false
    };

    this.onPlayerTimeUpdate = this.onPlayerTimeUpdate.bind(this);
    this.onPlayerPlayChange = this.onPlayerPlayChange.bind(this);
    this.onPlayerInitialized = this.onPlayerInitialized.bind(this);

    this.onStartScrub = this.onStartScrub.bind(this);
    this.onScrubbing = this.onScrubbing.bind(this);
    this.onEndScrub = this.onEndScrub.bind(this);

    this.onVolumeSliderChange = this.onVolumeSliderChange.bind(this);
    this.onVideoVolumeChange = this.onVideoVolumeChange.bind(this);
    this.evalLoggerRef = null;
  }

  on(event, listener) {
    this.observable.add(event, listener);
  }

  off(event, listener) {
    this.observable.remove(event, listener);
  }

  componentDidMount() {
    this.player = this.props.playerRef.current;

    this.props.playerRef.current.on(TIME_UPDATE, this.onPlayerTimeUpdate);
    this.props.playerRef.current.on(PLAY_CHANGE, this.onPlayerPlayChange);
    this.props.playerRef.current.on(VOLUME_CHANGE, this.onVideoVolumeChange);
    this.props.playerRef.current.on(
      PLAYER_API_INITIALIZED,
      this.onPlayerInitialized
    );
  }

  componentWillUnmount() {
    if (this.props.playerRef.current) {
      this.props.playerRef.current.off(TIME_UPDATE, this.onPlayerTimeUpdate);
      this.props.playerRef.current.off(PLAY_CHANGE, this.onPlayerPlayChange);
      this.props.playerRef.current.off(VOLUME_CHANGE, this.onVideoVolumeChange);
      this.props.playerRef.current.off(
        PLAYER_API_INITIALIZED,
        this.onPlayerInitialized
      );
    }
  }

  onPlayerInitialized() {
    this.setState({
      videoVolume: this.player.getVolume() * 100,
      videoDuration: this.player.getDuration()
    });
  }

  onPlayerPlayChange(state) {
    console.log("playstate", state);

    this.setState({ videoIsPlaying: state });
  }

  onPlayerTimeUpdate(time, percent) {
    // console.log("PlaybackInterface", time, percent);
    this.setState({
      currentExternalPerc: percent * SLIDER_STEPS,
      currentPlayTime: time
    });
  }

  previewVideo() {
    const targetTime =
      (this.state.currentUserPerc / SLIDER_STEPS) * this.player.getDuration();
    this.player.seek(targetTime);
  }

  onStartScrub(e) {
    this.player.scrubMode(true);
    // console.log("scrubstart", e);
    this.setState({
      userControlled: true,
      scrubbing: true,
      currentUserPerc: e,
      scrubCount: 0
      // lastMediaActionHash: this.getCurrentMediaActionHash()
    });

    this.previewVideo();

    if (this.props.localState.syncState.sync)
      this.props.setSyncScrubPerc(e / SLIDER_STEPS);

    // shareTransientAwareness(this.props.roomId, "scrubbing", true, true);
    // this.props.onBeginScrub();
    // this.setState({ userControlled: true, currentPlayTime: e.target.value });
  }

  onScrubbing(e) {
    const calculatedTime =
      (this.state.currentUserPerc / SLIDER_STEPS) * this.player.getDuration();
    this.setState({
      currentUserPerc: e,
      currentPlayTime: calculatedTime,
      scrubCount: this.state.scrubCount + 1
    });

    this.previewVideo();

    if (this.props.localState.syncState.sync)
      this.props.setSyncScrubPerc(e / SLIDER_STEPS);
  }

  onEndScrub(e) {
    this.player.scrubMode(false);

    this.setState({ currentUserPerc: e });
    this.previewVideo();

    var targetTime;

    // TODO check: time is incorrect if we didn't scrub at least 1 time
    if (this.state.scrubCount <= 1) {
      targetTime =
        (this.state.currentUserPerc / SLIDER_STEPS) * this.player.getDuration();
    } else {
      targetTime = this.state.currentPlayTime;
    }

    this.observable.dispatch(SEEK_REQUEST, targetTime);

    this.setState({
      scrubbing: false,
      scrubCount: 0
    });

    setTimeout(() => {
      if (!this.state.scrubbing) this.setState({ userControlled: false });
    }, 500);

    // shareTransientAwareness(this.props.roomId, "scrubbing", false, true);

    if (this.props.localState.syncState.sync) this.props.resetSyncScrubPerc();
  }

  onPlayClick() {
    // console.log("PLAY");
    this.observable.dispatch(PLAY_REQUEST);
  //  this.evalLoggerRef.logToEvaluation(this.constructor.name, PLAY_VIDEO, "");

  }

  onStopClick() {
    // console.log("STOP");
    
    this.observable.dispatch(PAUSE_REQUEST);
  //  this.evalLoggerRef.logToEvaluation(this.constructor.name, STOP_VIDEO, "");
  }

  onVideoVolumeChange() {
    // console.log("VOLUMECHANGE", this.player.getVolume());

    this.setState({ videoVolume: this.player.getVolume() * 100 });
  }

  onVolumeSliderChange(e) {
    this.player.setVolume(e / 100);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ currentExternalPerc: nextProps.currentPercent * SLIDER_STEPS });
  // }

  renderPlayBackButton() {
    const play = !this.state.videoIsPlaying;
    const isSync = this.props.localState.syncState.sync;

    return (
      <button id="play-button"
        title="Play- und Pausetaste"
        type="button"
        className={classnames("btn", {
          "btn-success": isSync,
          "btn-danger": !isSync
        })}
        onClick={
          play ? this.onPlayClick.bind(this) : this.onStopClick.bind(this)
        }
      > {this.props.assistent.actInstruction ? this.props.assistent.active && this.props.assistent.actInstruction.markers === "play-button" ?
        <HintArrow
          style={{ position: "absolute", marginTop: -70, marginLeft: -10, zIndex: 1000 }}
          direction="down"
        /> : null : null}
        <EvalLogger createRef={el => (this.evalLoggerRef = el)} />
        <i
          className={classnames("fa", {
            "fa-play-circle": play,
            "fa-pause-circle": !play
          })}
        />
      </button>
    );
  }

  onMouseOverTime() {
    this.setState({ showDuration: true });
  }

  onMouseOutTime() {
    this.setState({ showDuration: false });
  }

  render() {
    const targetPerc = this.state.userControlled
      ? this.state.currentUserPerc
      : this.state.currentExternalPerc;

    const scrubbingClient = getRemoteScrubClient(
      this.props.rooms.rooms[this.props.roomId].state.sharedRoomData
    );
    const preventInteraction = scrubbingClient != null;

    return (
      <div className="playback-interface hFlexLayout">
        {this.renderPlayBackButton()}

        <div className="slider-area ">
          <SectionLine
            roomId={this.props.roomId}
            videoDuration={this.state.videoDuration}
          />
          <Slider
            disabled={preventInteraction}
            min={0}
            max={SLIDER_STEPS}
            value={targetPerc}
            onBeforeChange={this.onStartScrub}
            onChange={this.onScrubbing}
            onAfterChange={this.onEndScrub}
            handle={props => (
              <TimeLineHandle
                offset={props.offset}
                isSyncSpace={this.props.localState.syncState.sync}
                disabled={
                  preventInteraction && this.props.localState.syncState.sync
                }
              />
            )}
          />
          <CueLine
            roomId={this.props.roomId}
            videoDuration={this.state.videoDuration}
          />
          <PresenceLine
            roomId={this.props.roomId}
            videoDuration={this.state.videoDuration}
          />
          <RemoteScrubLine roomId={this.props.roomId} />
        </div>

        <Slider
          min={0}
          max={100}
          value={this.state.videoVolume}
          onChange={this.onVolumeSliderChange}
          className="volume-slider mr-3"
        />

        <div
          onMouseEnter={this.onMouseOverTime.bind(this)}
          onMouseLeave={this.onMouseOutTime.bind(this)}
          className="time-wrapper mr-2"
        >
          <TimeDisplay seconds={this.state.currentPlayTime} />
          {this.state.showDuration ? (
            <span>
              <br />/<TimeDisplay seconds={this.state.videoDuration} />
            </span>
          ) : null}
        </div>
        <div>
          <FeatureRenderer feature={FEATURES.ANNOTATING}>
            <AnnotationDropDown playerRef={this.props.playerRef} />
          </FeatureRenderer>
          <FeatureRenderer feature={FEATURES.MARKERS}>
            <MarkerDropDown />
          </FeatureRenderer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  rooms: state.rooms,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { setSyncScrubPerc, resetSyncScrubPerc }
)(PlayBackInterface);
