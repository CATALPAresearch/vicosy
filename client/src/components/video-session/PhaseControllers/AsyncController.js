import { connect } from "react-redux";
import React, { Component } from "react";
import { setAsyncTime } from "../../../actions/localStateActions";
import { TIME_UPDATE } from "../AbstractVideoEvents";

const asyncTimeUpdateDelta = 3; // update if last state is x seconds away
// directly converts user interactions to videoplayer commands
// saves current play behaviour into shared localState
class AsyncController extends Component {
  constructor(props) {
    super(props);

    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
  }

  render() {
    return null;
  }

  // TODO: check if to submit position on play
  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      // we are now async
    } else if (this.props.active && !nextProps.active) {
      // we are in sync space
    }
  }

  onPlayRequest() {
    this.props.playerRef.current.playCurrent();
  }

  onPauseRequest() {
    this.props.playerRef.current.pauseCurrent();
    this.props.setAsyncTime(this.props.playerRef.current.getCurrentTime());
  }

  onSeekRequest(targetTime) {
    // TODO: better use seek and check why handle is jumping
    this.props.playerRef.current.pause(targetTime);
    // this.props.setAsyncTime(targetTime);
  }

  onVideoTimeUpdate() {
    if (this.props.active) {
      const lastSetTime = this.props.localState.syncState.asyncTimestamp;
      const currentTime = this.props.playerRef.current.getCurrentTime();
      const delta = Math.abs(lastSetTime - currentTime);
      if (delta < asyncTimeUpdateDelta) return;
      this.props.setAsyncTime(currentTime);
    }
  }

  componentDidMount() {
    this.props.onRef(this);
    window.sessionEvents.add(TIME_UPDATE, this.onVideoTimeUpdate);
  }

  componentWillUnmount() {
    this.props.onRef(null);
    if (window.sessionEvents)
      window.sessionEvents.remove(TIME_UPDATE, this.onVideoTimeUpdate);
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setAsyncTime }
)(AsyncController);
