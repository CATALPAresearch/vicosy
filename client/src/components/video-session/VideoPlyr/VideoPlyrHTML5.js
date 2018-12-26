import React, { Component } from "react";
// import Plyr from "react-plyr";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import PropTypes from "prop-types";
import "./video-plyr.css";

const REQUIRED_TIMEUPDATE_COUNT_BEFORE_UNSTALLED_TARGETFRAME = 2;

export default class VideoPlyrHTML5 extends Component {
  constructor(props) {
    super(props);

    this.playerTest = React.createRef();

    this.currentRealTime = 0;

    this.correctionMode = false;
    // this.volumeTemp = 1;
    this.pauseCompletedCallBack = null;
    this.timeUpdateCountSinceLastCorrectionMode = 0;

    this.state = {
      stalledByVideo: true,
      stalledByTargetFrame: false,
      stalledByWrongTime: false,
      stalled: true,
      lastActionPause: false,
      playerApiInitialized: false,
      lastTargetTime: -1 // required time to reach
    };

    // this.playerRef = React.createRef();
    this.playInternal = this.playInternal.bind(this);
  }

  playInternal(play) {
    if (this.player.paused && play) {
      console.log("Req to play");
      this.player.play();
    } else if (!this.player.paused && !play) {
      console.log("Req to pause");
      this.player.pause();
    }
  }

  isReadyToPlay() {
    console.log(
      "Stalled? Video, TargetFrame, WrongTime",
      this.state.stalledByVideo,
      this.state.stalledByTargetFrame,
      this.state.stalledByWrongTime
    );

    return !this.state.stalled;
  }

  isPlayerApiInitialized() {
    return this.state.playerApiInitialized;
  }

  getCurrentTime() {
    return this.currentRealTime;
  }

  playCurrent() {
    this.setState({ lastActionPause: false, lastTargetTime: -1 });
    this.playInternal(true);
    // else this.play(this.currentRealTime);
  }

  play(time) {
    this.correctionMode = false;
    // this.player.volume = 1;
    this.setStalledTargetFrame(false);
    this.setState({ lastActionPause: false, lastTargetTime: time });
    // console.log("settime to ", time);

    this.player.currentTime = time;
    this.playInternal(true);
  }

  fixTime(time) {
    this.player.currentTime = time;
  }

  pauseCurrent() {
    this.setState({ lastActionPause: true, lastTargetTime: -1 });
    this.playInternal(false);
  }

  pause(time, cb) {
    this.pauseCompletedCallBack = null;

    if (this.isReadyToPlay() && time === this.state.lastTargetTime) {
      if (cb) {
        setTimeout(() => {
          cb();
        }, 100);
      }
      return;
    }

    this.pauseCompletedCallBack = cb;
    this.setStalledTargetFrame(true);
    // if (!this.correctionMode) this.volumeTemp = this.player.volume;
    this.timeUpdateCountSinceLastCorrectionMode = 0;
    this.correctionMode = true;
    // this.player.volume = 0;
    this.setState({ lastActionPause: true, lastTargetTime: time });
    this.currentRealTime = time;

    this.player.currentTime = time;

    this.playInternal(true);
    this.props.onTimeUpdate(this.currentRealTime);
  }

  seek(time) {
    this.currentRealTime = time;
    this.player.currentTime = time;
  }

  getDuration() {
    return this.player.duration;
  }

  isPaused() {
    // return this.player.paused;
    return this.state.lastActionPause;
  }

  setVolume(perc) {
    this.player.volume = perc;
  }

  getVolume() {
    return this.player.volume;
  }

  // OBSOLETE - CHECK, DO NOT USE!
  isPlaying() {
    return this.player.playing;
  }

  componentWillUnmount() {
    if (this.player) this.player.destroy();
  }

  componentDidMount() {
    this.player = new Plyr("#player", {
      clickToPlay: false,
      controls: [],
      volume: 1,
      debug: false,
      muted: false,
      autopause: false
    });

    this.player.on("ready", event => {
      this.player.on("loadedmetadata", e => {
        this.setState({ playerApiInitialized: true });
        this.props.onPlayerApiInitialized();
      });

      // const instance = event.detail.plyr;
      this.player.on("timeupdate", e => {
        console.log("begin time update");

        if (this.correctionMode) ++this.timeUpdateCountSinceLastCorrectionMode;

        if (this.checkPauseMode()) return;

        this.currentRealTime = this.player.currentTime;

        // we need the time to reach
        if (this.state.lastTargetTime != -1) {
          this.currentRealTime = this.state.lastTargetTime;
          const diff = Math.abs(
            this.state.lastTargetTime - this.currentRealTime
          );
          // console.log("TARGET TIME DIFF", diff);

          if (diff < 2) {
            // we reached our target
            this.setStalledWrongTime(false);
            this.setState({ lastTargetTime: -1 });
          } else {
            this.setStalledWrongTime(true);
          }
        }
        this.props.onTimeUpdate(this.currentRealTime);
      });

      // Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).
      this.player.on("playing", e => {
        console.log("begin play");

        if (!this.correctionMode && this.state.lastActionPause) {
          this.playInternal(false);
          return;
        }
        // hack: for some reason player sometimes plays after pause and timeset

        this.props.onPlaying();
      });

      this.player.on("pause", e => {
        this.props.onPaused();
      });

      this.player.on("volumechange", e => {
        this.props.onVolumeChange();
      });

      // this.player.on(
      //   "playing pause canplay waiting stalled loadeddata emptied error",
      //   e => {
      //     console.log("CANPLAY TRIGGERED");
      //   }
      // );

      this.player.on("stalled", e => {
        console.log("plyr stalled");

        this.setStalledVideo(true);
      });

      this.player.on("error", e => {
        console.log("plyr error");

        this.setStalledVideo(true);
      });

      this.player.on("waiting", e => {
        console.log("plyr waiting");

        this.setStalledVideo(true);
      });

      this.player.on("canplay", e => {
        console.log("plyr canplay");

        this.setStalledVideo(false);
      });

      this.player.on("loadeddata", e => {
        console.log("loadeddata", e);
      });
    });
  }

  checkPauseMode() {
    console.log(
      "Check pause mode",
      this.timeUpdateCountSinceLastCorrectionMode
    );

    if (this.state.lastActionPause) {
      if (
        this.correctionMode &&
        this.timeUpdateCountSinceLastCorrectionMode >=
          REQUIRED_TIMEUPDATE_COUNT_BEFORE_UNSTALLED_TARGETFRAME
      ) {
        this.player.currentTime = this.currentRealTime;
        this.setStalledTargetFrame(false);
        // this.player.volume = this.volumeTemp;
        this.timeUpdateCountSinceLastCorrectionMode = 0;
        this.correctionMode = false;
        if (this.pauseCompletedCallBack) this.pauseCompletedCallBack();
        this.playInternal(false);
      }

      return true;
    }

    return false;
  }

  setStalledTargetFrame(stalled) {
    if (this.state.stalledByTargetFrame !== stalled) {
      this.setState({ stalledByTargetFrame: stalled });
    }
    this.updateStalledState();
  }

  setStalledVideo(stalled) {
    if (this.state.stalledByVideo !== stalled) {
      this.setState({ stalledByVideo: stalled });
    }
    this.updateStalledState();
  }

  setStalledWrongTime(stalled) {
    if (this.state.stalledByWrongTime !== stalled) {
      this.setState({ stalledByWrongTime: stalled });
    }
    this.updateStalledState();
  }

  updateStalledState() {
    const targetStalled =
      this.state.stalledByVideo ||
      this.state.stalledByWrongTime ||
      this.state.stalledByTargetFrame;

    if (this.state.stalled === targetStalled) {
      console.log("SAME stalled", this.state);
      return;
    }

    this.setState({ stalled: targetStalled });
    this.props.onReadyToPlayChanged(!targetStalled);
    console.log("DISPATCH stalled", targetStalled);
  }

  render() {
    return (
      <div>
        <video
          poster="http://aimvideoproduction.com/wp-content/uploads/2011/03/Video-Reel-and-Film-Canister2.png"
          id="player"
          playsInline
        >
          <source src={this.props.videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  }
}

VideoPlyrHTML5.propTypes = {
  videoUrl: PropTypes.string.isRequired
};
