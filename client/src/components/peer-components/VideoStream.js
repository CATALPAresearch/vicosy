import React, { Component } from "react";
import PropTypes from "prop-types";
import { getStream, unregisterStream } from "../../stream-model/StreamModel";
// import {
//   connectToAllAndStream,
//   disconnectMyStream
// } from "../../p2p-handlers/P2PConnectionManager";
import { STREAM_AVAILABLE } from "../../stream-model/streamEvents";
import { ownSocketId } from "../../socket-handlers/api";
import "./StreamPlayer.css";

class VideoStream extends Component {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
    this.audioRef = React.createRef();

    this.state = {
      mediaAvailable: false,
      mediaSource: null,
      streamActive: false,
      mediaType: "none" // none, dummy, video, audio
    };

    this.onStreamAvailable = this.onStreamAvailable.bind(this);
  }

  componentWillMount() {
    window.streamEvents.add(STREAM_AVAILABLE, this.onStreamAvailable);
  }

  componentWillUnmount() {
    window.streamEvents.remove(STREAM_AVAILABLE, this.onStreamAvailable);
    // disconnectMyStream(this.props.roomId);
    unregisterStream(this.props.roomId, this.props.clientId);
  }

  onStreamAvailable(roomId, clientId) {
    if (this.props.roomId === roomId && this.props.clientId === clientId)
      this.updateGetStream();
  }

  updateGetStream() {
    const stream = getStream(this.props.roomId, this.props.clientId);
    if (stream) {
      const { video, audio } = stream.validTracks;
      var mediaType = "none";
      if (!video && !audio) mediaType = "dummy";
      else if (!video) mediaType = "audio";
      else mediaType = "video";

      this.setState({
        mediaAvailable: true,
        mediaSource: stream,
        mediaType: mediaType
      });
      console.log("stream ---->", this.state, stream);
    }
  }

  componentDidMount() {
    this.updateGetStream();

    // if (this.props.clientId === ownSocketId()) {
    //   this.initOwnStream();
    // }
  }

  // initOwnStream() {
  //   getUserMedia({ video: true, audio: true }, (err, stream) => {
  //     if (err) return console.error(err);

  //     registerStream(this.props.roomId, ownSocketId(), stream);
  //     connectToAllAndStream(this.props.roomId);
  //   });
  // }

  componentDidUpdate() {
    if (!this.state.mediaAvailable || this.state.streamActive) return;

    var targetMedia = null;

    switch (this.state.mediaType) {
      case "video":
        targetMedia = this.videoRef.current;
        break;
      case "audio":
        targetMedia = this.audioRef.current;
        break;
      default:
        targetMedia = null;
        break;
    }

    if (targetMedia && this.state.mediaAvailable) {
      try {
        targetMedia.srcObject = this.state.mediaSource;
        if (this.props.clientId === ownSocketId()) targetMedia.volume = 0;
      } catch (error) {
        targetMedia.src = URL.createObjectURL(this.state.mediaSource);
      }
      this.setState({ streamActive: true });
    }
  }

  render() {
    const videoContent = (
      // <div className="roundedMask-1">
      <video
        className="roundedStrong stream-player"
        ref={this.videoRef}
        width="320"
        height="240"
        controls
        autoPlay
        playsInline
      >
        Video not supported
      </video>
      // </div>
    );

    const audioContent = (
      // <div className="roundedMask-1">
      <audio
        className="roundedStrong stream-player"
        ref={this.audioRef}
        width="100%"
        height="200"
        controls
        autoPlay
        playsInline
      >
        audio not supported
      </audio>
      // </div>
    );

    const videoUnavailableContent = null;
    const dummyContent = <h1>Dummy</h1>;

    var targetContent;
    if (this.state.mediaAvailable) {
      switch (this.state.mediaType) {
        case "video":
          targetContent = videoContent;
          break;
        case "audio":
          targetContent = audioContent;
          break;
        case "dummy":
          targetContent = dummyContent;
          break;
        default:
          targetContent = videoUnavailableContent;
          break;
      }
    } else targetContent = videoUnavailableContent;

    // var targetContent = this.state.mediaAvailable
    //   ? videoContent
    //   : videoUnavailableContent;

    return targetContent;
  }
}

VideoStream.propTypes = {
  roomId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
};

export default VideoStream;
