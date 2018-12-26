import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default class PlayBackControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrubbing: false,
      currentExternalPerc: 0,
      currentUserPerc: 0,
      userControlled: false,
      lastMediaActionHash: ""
    };
  }

  onStartScrub(e) {
    console.log("scrubstart", e);
    this.setState({
      userControlled: true,
      scrubbing: true
      // lastMediaActionHash: this.getCurrentMediaActionHash()
    });

    this.props.onBeginScrub();
    // this.setState({ userControlled: true, currentPlayTime: e.target.value });
  }

  onScrubbing(e) {
    this.setState({ currentUserPerc: e });
    this.props.onScrubbing(e / 1000);
    // console.log("scrubbing", e);
    // this.setState({ userControlled: true, currentPlayTime: e.target.value });
  }

  onEndScrub(e) {
    this.props.onPlayPercRequest(this.state.currentUserPerc / 1000);
    console.log("scrubend", e, e / 1000, this.state.currentUserPerc);
    this.setState({
      scrubbing: false
      // userControlled: false
    });

    setTimeout(() => {
      if (!this.state.scrubbing) this.setState({ userControlled: false });
    }, 500);

    this.props.onEndScrub();
    // will be reset in answer
    // this.setState({ userControlled: false });
  }

  onPlayClick() {
    console.log("PLAY");
  }

  onStopClick() {
    console.log("STOP");
  }

  componentWillReceiveProps(nextProps) {
    // check if we have to reset user control
    // var resetUserControlled = false;
    // if (!this.state.scrubbing && this.state.userControlled) {
    //   console.log(
    //     "RESET USER CONTROLLED",
    //     this.props.processedHash != nextProps.processedHash,
    //     this.props.processedHash,
    //     nextProps.processedHash
    //   );

    //   if (this.props.processedHash != nextProps.processedHash)
    //     resetUserControlled = true;
    // }

    // console.log(
    //   "currentperc, hash",
    //   nextProps.currentPercent * 1000,
    //   resetUserControlled
    // );

    // if (resetUserControlled)
    //   this.setState({
    //     userControlled: false,
    //     currentExternalPerc: nextProps.currentPercent * 1000
    //   });
    // else
    this.setState({ currentExternalPerc: nextProps.currentPercent * 1000 });
  }

  // getCurrentMediaActionHash() {
  //   const { roomAvailable, roomData } = this.props.roomState;

  //   if (!roomAvailable) return "";

  //   if ("syncAction" in roomData.state.sharedRoomData) {
  //     const syncAction = roomData.state.sharedRoomData.syncAction;

  //     const { hash } = syncAction;
  //     console.log("MEDIA HASH ---------------- >", hash);

  //     return hash;
  //   }

  //   return "";
  // }

  render() {
    const targetPerc = this.state.userControlled
      ? this.state.currentUserPerc
      : this.state.currentExternalPerc;

    return (
      <div>
        {/* <button
          type="button"
          className="btn btn-info"
          onClick={this.onPlayClick.bind(this)}
        >
          Play
        </button>

        <button
          type="button"
          className="btn btn-info"
          onClick={this.onStopClick.bind(this)}
        >
          Pause
        </button> */}

        <Slider
          min={0}
          max={1000}
          value={targetPerc}
          onBeforeChange={this.onStartScrub.bind(this)}
          onChange={this.onScrubbing.bind(this)}
          onAfterChange={this.onEndScrub.bind(this)}
        />
      </div>
    );

    PlayBackControls.propTypes = {
      currentPercent: PropTypes.number.isRequired,
      onPlayPercRequest: PropTypes.func.isRequired,
      onScrubbing: PropTypes.func.isRequired,
      onBeginScrub: PropTypes.func.isRequired,
      onEndScrub: PropTypes.func.isRequired,
      roomState: PropTypes.object.isRequired,
      processedHash: PropTypes.string
    };
  }
}
