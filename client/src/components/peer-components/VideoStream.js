import React, { Component } from "react";
import PropTypes from "prop-types";
import { getStream, unregisterStream } from "../../stream-model/StreamModel";
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
  }

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
    const isOwnStream = this.props.clientId === ownSocketId();

    const videoContent = (
      <video
        className="roundedStrong stream-player"
        ref={this.videoRef}
        width={isOwnStream ? "224" : "224"}
        height={isOwnStream ? "168" : "168"}
        controls
        autoPlay
        playsInline
      >
        Video not supported
      </video>
    );

    const audioContent = (
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

    return targetContent;
  }
}

VideoStream.propTypes = {
  roomId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired
};

export default VideoStream;
