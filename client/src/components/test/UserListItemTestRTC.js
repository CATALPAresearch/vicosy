import React, { Component } from "react";
import VideoStream from "../peer-components/VideoStream";
import ClientName from "../controls/ClientName";
import { ownSocketId } from "../../socket-handlers/api";

export default class UserListItemTestRTC extends Component {
  render() {
    const clientId = this.props.clientId;
    const isOwn = ownSocketId() === clientId;

    if (!this.props.roomData) return null;

    return (
      <div key={clientId}>
        <span>
          <ClientName roomData={this.props.roomData} clientId={clientId} />
          {isOwn ? "(me)" : ""}
          {clientId}
        </span>
        <div>
          <VideoStream
            roomId={this.props.roomData.state.roomId}
            clientId={clientId}
          />
          {/* <button onClick={this.onP2PRequest.bind(this)}>P2P request</button> */}
        </div>
      </div>
    );
  }
}
