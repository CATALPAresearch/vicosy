import React, { Component } from "react";
import { connect } from "react-redux";
import {
  logoutRoom,
  loginRoom,
  logoutRooms,
  clearRoomErrors
} from "../../actions/roomActions";
import { setError, clearError } from "../../actions/errorActions";
import { connectSocket, disconnectSocket } from "../../socket-handlers/api";
import { JOIN_ROOM, LEAVE_ROOM } from "./socketEvents";
import "./socketcontroller.css"

// listens to auth state
// connects to socket or closes it based on this state
class SocketController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInRooms: {},
      socketConnected: false,
      connectionState: "disconnected"
    };

    this.onSocketConnected = this.onSocketConnected.bind(this);
    this.onSocketDisconnected = this.onSocketDisconnected.bind(this);

    this.onJoinRoomRequest = this.onJoinRoomRequest.bind(this);
    this.onLeaveRoomRequest = this.onLeaveRoomRequest.bind(this);
  }

  componentWillMount() {
    window.socketEvents.add(JOIN_ROOM, this.onJoinRoomRequest);
    window.socketEvents.add(LEAVE_ROOM, this.onLeaveRoomRequest);
  }

  componentWillUnmount() {
    window.socketEvents.remove(JOIN_ROOM, this.onJoinRoomRequest);
    window.socketEvents.remove(LEAVE_ROOM, this.onLeaveRoomRequest);
  }

  onJoinRoomRequest(roomId) {
    this.props.loginRoom(roomId);

    if (roomId.indexOf("_stream") !== -1) {
      const loggedInRooms = this.state.loggedInRooms;
      loggedInRooms[roomId] = true;
      this.setState({ loggedInRooms });
    }
  }

  onLeaveRoomRequest(roomId) {
    this.props.logoutRoom(roomId); // this will clear redux room state

    const loggedInRooms = this.state.loggedInRooms;
    delete loggedInRooms[roomId];

    this.setState({ loggedInRooms });

    // todo: check if this can be done directly in the action
    this.props.clearRoomErrors(roomId);
  }

  componentDidMount() {
    this.updateConnection();
  }

  componentDidUpdate() {
    this.updateConnection();
  }

  updateConnection() {
    if (this.props.auth.isAuthenticated) {
      if (this.state.connectionState === "disconnected") {
        this.setState({ connectionState: "connectionPending" });
        connectSocket(
          this.onSocketConnected,
          this.onSocketDisconnected,
          this.props.auth.token
        );
      }
    } else disconnectSocket();
  }

  onSocketConnected() {
    console.log("SocketController", "connected");
    // für den Trainerraum müsste hier trainerlobby stehen
    console.log(this.props.auth.user.role);
    switch (this.props.auth.user.role) {
      case "TRAINER":
        this.props.loginRoom("memberlist");
        break;
      case "STUDENT":
        this.props.loginRoom("studentlobby");
        break;
      default:
        this.props.loginRoom("studentlobby");
        break;
    }

    


    // restore logged in rooms
    // currently disabled since rooms will connect themselves
    // const roomsToLogin = Object.keys(this.state.loggedInRooms);
    // roomsToLogin.forEach(roomId => {
    //   console.log("REJOIN", roomId);

    //   this.props.loginRoom(roomId);
    // });

    this.props.clearError("socket_disconnect");
    this.setState({ socketConnected: true, connectionState: "connected" });
  }

  onSocketDisconnected() {
    console.log("SocketController", "disconnected");
    this.props.logoutRooms(); // this will clear redux room state

    const loggedInRooms = Object.keys(this.state.loggedInRooms);
    loggedInRooms.forEach(roomId => {
      // todo: check if this can be done directly in the action
      this.props.clearRoomErrors(roomId);
    });

    this.props.setError("socket_disconnect", true);

    this.setState({ socketConnected: false, connectionState: "disconnected" });
  }

  render() {
    var connected = this.state.socketConnected;

    const connectionContent = this.props.children;
    const disconnectedContent = (
      <div className="socketController">
        <h1>connecting...</h1>
      </div>
    );

    const targetContent =
      connected || !this.props.auth.isAuthenticated
        ? connectionContent
        : disconnectedContent;

    return targetContent;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginRoom, logoutRoom, logoutRooms, clearRoomErrors, setError, clearError }
)(SocketController);
