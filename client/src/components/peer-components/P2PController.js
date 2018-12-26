import { connect } from "react-redux";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { offerPeer, consumePeer } from "../../actions/p2pActions";
import { ownSocketId } from "../../socket-handlers/api";
import { getStream, registerStream } from "../../stream-model/StreamModel";
import { STREAM_AVAILABLE } from "../../stream-model/streamEvents";

class P2PController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peerOffered: false
    };

    this.onStreamAvailable = this.onStreamAvailable.bind(this);
  }

  componentWillMount() {
    window.streamEvents.add(STREAM_AVAILABLE, this.onStreamAvailable);
  }

  componentWillUnmount() {
    window.streamEvents.remove(STREAM_AVAILABLE, this.onStreamAvailable);
  }

  onStreamAvailable(roomId, clientId) {
    if (
      !this.state.peerOffered &&
      this.props.roomId === roomId &&
      clientId === ownSocketId()
    ) {
      const stream = getStream(roomId, clientId);
      if (stream) offerPeer(roomId, stream);
      this.setState({ peerOffered: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { roomAvailable, roomData } = nextProps.roomState;

    this.connectToAllHosts();
  }

  connectToAllHosts() {
    const { roomAvailable, roomData } = this.props.roomState;

    console.log("PREPARE CONSUMING PEER", this.props.roomId);
    if (roomAvailable && roomData.state.sharedRoomData) {
      const sharedData = roomData.state.sharedRoomData;
      const { clients } = sharedData;

      const clientIds = Object.keys(clients);
      console.log("PEER CLIENTS", clientIds);
      clientIds.forEach(clientId => {
        if (ownSocketId() === clientId) return;

        if ("p2pData" in clients[clientId]) {
          console.log("CONSUMING PEER", this.props.roomId, clientId);

          consumePeer(this.props.roomId, clientId, clients[clientId].p2pData);
        }
      });
    }
  }

  // onTest(e) {
  //   this.peer.send("TEST MESSAGE");
  // }

  // onConnect(e) {
  //   this.connectToAllHosts();
  // }

  render() {
    return null;
  }
}

P2PController.propTypes = {
  roomId: PropTypes.string.isRequired,
  roomState: PropTypes.object.isRequired
};

export default P2PController;
