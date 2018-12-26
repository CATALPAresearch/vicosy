import { connect } from "react-redux";
import React, { Component } from "react";
import { joinConference, leaveConference } from "./WebRtcConference";
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  ROOM_JOINED
} from "../logic-controls/socketEvents";
import UserListItemTestRTC from "./UserListItemTestRTC";
import UserList from "../userlist/UserList";
import RoomComponent from "../controls/RoomComponent";

class WebRtcConferenceTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streamRoomData: null,
      streamState: "waiting"
    };

    this.videoOtherRef = React.createRef();
    this.videoOwnRef = React.createRef();
    this.videoThirdRef = React.createRef();

    // this.onRemoteStream = this.onRemoteStream.bind(this);
    this.onRoomJoined = this.onRoomJoined.bind(this);
  }

  componentDidMount() {
    // this is later the session room id
    window.socketEvents.add(ROOM_JOINED, this.onRoomJoined);
    window.socketEvents.dispatch(JOIN_ROOM, "WebRtcTestRoom");
    // window.p2pEvents.add("remotestream", this.onRemoteStream);
  }

  componentWillUnmount() {
    // window.p2pEvents.remove("remotestream", this.onRemoteStream);
    // todo: test when this also needs to be dispatched
    window.socketEvents.remove(ROOM_JOINED, this.onRoomJoined);

    window.socketEvents.dispatch(LEAVE_ROOM, "WebRtcTestRoom");
    window.socketEvents.dispatch(LEAVE_ROOM, "WebRtcTestRoom_stream");
    //leaveConference();
    // window.socketEvents.dispatch(LEAVE_ROOM, "WebRtcTestRoom_stream");
  }

  onRoomJoined(roomId) {
    if (roomId === "WebRtcTestRoom") {
      // TODO: why timeout needed here?
      setTimeout(() => {
        joinConference("WebRtcTestRoom", false, false);
      }, 100);
    }
  }

  componentWillReceiveProps(nextProps) {
    // try {
    //   console.log("nextprops", nextProps);
    //   const streamRoomData =
    //     nextProps.rooms.rooms["WebRtcTestRoom" + "_stream"].state.sharedRoomData
    //       .streamRoomData;
    //   this.setState({ streamRoomData });
    // } catch (err) {}
    // if (
    //   this.state.streamRoomData &&
    //   this.state.streamState === "tryingToJoin"
    // ) {
    //   console.log("try join", this.state);
    //   conferenceUI.joinRoom({
    //     parentRoomId: "WebRtcTestRoom"
    //   });
    //   console.log("join room", this.state);
    //   this.setState({ streamState: "joined" });
    // }
  }

  onRemoteStream(stream, clientId) {
    console.log("register stream for", clientId);

    // registerStream("WebRtcTestRoom_stream", clientId, stream);
  }

  onJoinStreamClick(video, audio) {
    joinConference("WebRtcTestRoom", video, audio);
  }

  onLeaveConferenceClick() {
    // conferenceUI.leaveRoom();
    leaveConference();
    this.setState({ streamState: "waiting" });
  }

  renderOwnStream(stream) {
    this.videoOwnRef.current.srcObject = stream;
  }

  render() {
    return (
      <div>
        <h1>WebRTC Conference</h1>
        <button onClick={this.onJoinStreamClick.bind(this, true, true)}>
          Join Stream
        </button>
        <button onClick={this.onJoinStreamClick.bind(this, false, true)}>
          Join Stream (Audio only)
        </button>
        <button onClick={this.onJoinStreamClick.bind(this, true, false)}>
          Join Stream (Video only)
        </button>
        <button onClick={this.onJoinStreamClick.bind(this, false, false)}>
          Join Stream (No Media)
        </button>
        {/* {joinRoomContent} */}
        <button onClick={this.onLeaveConferenceClick.bind(this)}>
          Leave Room
        </button>

        <RoomComponent
          roomId={"WebRtcTestRoom_stream"}
          component={UserList}
          userListItemComponent={UserListItemTestRTC}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  null
)(WebRtcConferenceTest);
