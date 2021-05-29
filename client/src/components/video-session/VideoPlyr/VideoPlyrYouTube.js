import React, { Component } from "react";
// import Plyr from "react-plyr";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import PropTypes from "prop-types";
import "./video-plyr.css";
import EvalLogger from "../Evaluation/EvalLogger";
import { PLAYBACK } from "../Evaluation/EvalLogEvents";

//-1: Unstarted, 0: Ended, 1: Playing, 2: Paused, 3: Buffering, 5: Video cued. See the YouTube Docs for more information.
const stalledStates = [3];
const YT_STATE_PLAYING = 1;
const YT_STATE_PAUSED = 2;

export default class VideoPlyrYouTube extends Component {
  constructor(props) {
    super(props);

    this.playerTest = React.createRef();

    this.currentRealTime = 0;

    this.correctionMode = false;
    // this.volumeTemp = 1;
    this.pauseCompletedCallBack = null;

    this.state = {
      stalledByYouTube: false,
      stalledByTargetFrame: false,
      stalledByWrongTime: false,
      lastActionPause: false,
      playerApiInitialized: false,
      lastTargetTime: -1 // required time to reach
    };

    this.lastStalled = true;

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
      "Stalled? YT, TargetFrame, WrongTime",
      this.state.stalledByYouTube,
      this.state.stalledByTargetFrame,
      this.state.stalledByWrongTime
    );

    const {
      stalledByYouTube,
      stalledByTargetFrame,
      stalledByWrongTime
    } = this.state;

    return !stalledByYouTube && !stalledByTargetFrame && !stalledByWrongTime;
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

  logger() {
    var
      _this = this,
      interval = 2, // THE LENGTH OF AN INTERVAL IN SECONDS 
      lastposition = -1,
      timer
      ;

    function loop() {
      var currentinterval;
      currentinterval = (Math.round(_this.getCurrentTime()) / interval) >> 0;
      console.log("i:" + currentinterval + ", p:" + _this.getCurrentTime());
      if (currentinterval != lastposition) {
        // HERE YOU SHOUL ADD SOME CALL TO WRITE THE PLAYBACK EVENT INCL. currentinterval TO THE LOG FILE ECT:
        // {context:'player', action:'playback', values:[ currentinterval ]});
        // if (_this.evalLoggerRef)
        _this.evalLoggerRef.logToEvaluation(_this.constructor.name, PLAYBACK, currentinterval);

        lastposition = currentinterval;
      }
    }

    function start() {
      if (timer) {
        timer = clearInterval(timer);
      }
      timer = setInterval(loop, interval * 1000);
      setTimeout(loop, 100);
    }


    function stop() {
      timer = clearInterval(timer);
      loop();
    }


    this.player.on("statechange", e => {
      switch (e.detail.code) {
      
        case -1:
          stop();
          break;
        case 0:
          stop();
          break;
        case 1:
          start();
          break;
        case 2:
          stop();
          break;
      }
    });
    // this.video REFERS TO THE VIDEO ELEMENT
    /*
        this.player.addEventListener('play', function (e) {
          start();
        });
    
        this.player.addEventListener('pause', function (e) {
          stop();
        });
    
        this.player.addEventListener('abort', function (e) {
          stop();
        });
    
        this.player.addEventListener('ended', function (e) {
          stop();
        }, false);
        */

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
    this.logger();
    this.player.on("ready", event => {
      this.setState({ playerApiInitialized: true });
      this.props.onPlayerApiInitialized();

      // const instance = event.detail.plyr;
      this.player.on("timeupdate", e => {
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
        if (this.checkPauseMode()) {
          console.log("state correcting playing");
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

      this.player.on("statechange", e => {
        console.log("youtube state", e.detail.code);

        if (this.state.lastActionPause && e.detail.code === YT_STATE_PAUSED)
          this.setStalledYouTube(false);
        else if (
          !this.state.lastActionPause &&
          e.detail.code === YT_STATE_PLAYING
        )
          this.setStalledYouTube(false);
        else this.setStalledYouTube(true);
      });

      this.player.on("loadeddata", e => {
        console.log("loadeddata", e);
      });
    });
  }

  checkPauseMode() {
    if (this.state.lastActionPause /*&& !this.stalledByYouTube*/) {
      if (this.correctionMode) {
        this.player.currentTime = this.currentRealTime;
        this.setStalledTargetFrame(false);
        // this.player.volume = this.volumeTemp;
        this.correctionMode = false;
        if (this.pauseCompletedCallBack) this.pauseCompletedCallBack();
      }

      this.playInternal(false);
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

  setStalledYouTube(stalled) {
    if (this.state.stalledByYouTube !== stalled) {
      this.setState({ stalledByYouTube: stalled });
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
      this.state.stalledByYouTube ||
      this.state.stalledByWrongTime ||
      this.state.stalledByTargetFrame;

    if (this.lastStalled === targetStalled) {
      console.log("prevent stall update, same state", this.state);
      return;
    }

    this.lastStalled = targetStalled;
    this.props.onReadyToPlayChanged(!targetStalled);
    console.log("DISPATCH stalled", targetStalled);
  }

  // onLoadedData() {
  //   console.log(
  //     "PLYR loaded data. duration",
  //     this.playerRef.current.getDuration()
  //   );
  // }

  render() {
    return (
      <div>
        <EvalLogger createRef={el => (this.evalLoggerRef = el)} />
        <div
          ref={this.playerTest}
          id="player"
          data-plyr-provider="youtube"
          data-plyr-embed-id={this.props.videoUrl}
          allowfullscreen
          allowtransparency
          allow="autoplay"
        />
      </div>
    );
  }
}

VideoPlyrYouTube.propTypes = {
  videoUrl: PropTypes.string.isRequired
};
