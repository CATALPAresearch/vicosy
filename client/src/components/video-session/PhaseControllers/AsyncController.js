import { connect } from "react-redux";
import React, { Component } from "react";
import { setAsyncTime } from "../../../actions/localStateActions";

// directly converts user interactions to videoplayer commands
// saves current play behaviour into shared localState
class AsyncController extends Component {
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
    this.props.setAsyncTime(targetTime);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { setAsyncTime }
)(AsyncController);
