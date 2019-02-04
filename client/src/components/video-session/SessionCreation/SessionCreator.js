import { connect } from "react-redux";
import React, { Component } from "react";
import { createSession, ownSocketId } from "../../../socket-handlers/api";
import { LOG_ERROR } from "../../logic-controls/logEvents";
import {
  SESSION_DEFAULT,
  SESSION_PEER_TEACHING
} from "../../../shared_constants/sessionTypes";

class SessionCreator extends Component {
  constructor(props) {
    super(props);

    this.urlInput = React.createRef();
    this.sessionTypeRef = React.createRef();

    this.state = {
      // videourl: process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   ? process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   : "https://www.dropbox.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      videourl:
        "https://dl.dropboxusercontent.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      sessionname: "Meine Video Session",
      inputEdited: false
    };
  }

  componentDidMount() {
    this.sessionNameUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.sessionNameUpdate(nextProps);
  }

  sessionNameUpdate(props) {
    if (this.inputEdited) return;

    try {
      const ownNick =
        props.rooms.rooms.lobby.state.sharedRoomData.clients[ownSocketId()]
          .nick;
      this.setState({ sessionname: ownNick + "'s Video Session" });
    } catch (e) {}
  }

  onSubmit(e) {
    e.preventDefault();

    const { videourl, sessionname } = this.state;
    if (videourl && sessionname)
      createSession(sessionname, videourl, this.sessionTypeRef.current.value);
    else {
      window.logEvents.dispatch(LOG_ERROR, {
        message: `Enter valid session name and video url (currently only youtube supported)`
      });
    }
  }

  onClearUrl() {
    this.setState({ videourl: "" });
    this.urlInput.current.focus();
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value, inputEdited: true });
  }

  render() {
    const scriptsEnabled = this.props.auth.user.name !== "Guest";

    return (
      <form onSubmit={this.onSubmit.bind(this)} className="mb-2">
        <span className="hFlexLayout">
          <label className="sr-only" htmlFor="sessionname">
            Session name
          </label>
          <input
            id="sessionname"
            value={this.state.sessionname}
            type="text"
            className="form-control form-control-lg mr-sm-2"
            placeholder="Session Name"
            onChange={this.handleChange.bind(this)}
          />

          <label className="sr-only" htmlFor="videourl">
            Url Input
          </label>

          <input
            ref={this.urlInput}
            id="videourl"
            value={this.state.videourl}
            type="text"
            className="form-control form-control-lg mr-sm-2"
            placeholder="Video URL"
            onChange={this.handleChange.bind(this)}
          />

          <input
            type="button"
            className="btn btn-outline-secondary mr-sm-2"
            value="Clear"
            onClick={this.onClearUrl.bind(this)}
          />

          <select ref={this.sessionTypeRef} className="form-control mr-sm-2">
            <option
              value={SESSION_PEER_TEACHING}
              title={
                scriptsEnabled
                  ? "Controlled learning via collaboration script 'Peer teaching'. Description... Required peers: 2"
                  : "Not available for guest accounts"
              }
              disabled={!scriptsEnabled}
            >
              Scripted Peer Teaching
            </option>
            <option
              value={SESSION_DEFAULT}
              title="Uncontrolled video conversation without member limit."
            >
              Default Video Conversation
            </option>
          </select>

          <input
            type="submit"
            className="btn btn-info btn-lg"
            value="Create Session"
          />
        </span>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(SessionCreator);
