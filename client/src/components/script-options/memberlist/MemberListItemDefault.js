import React, { Component } from "react";
import { ownSocketId } from "../../../socket-handlers/api";
import classnames from "classnames";
import TransientAwareness from "./TransientAwareness";
import ClientName from "../../controls/ClientName";

export default class MemberListItemDefault extends Component {
  render() {
    const clientId = this.props.clientId;

    const roomData = this.props.roomData;
    // const client = roomData.state.sharedRoomData.clients[clientId];

    const isOwn = ownSocketId() === clientId;

    return (
      <li
        key={clientId}
        className={classnames(
          "list-group-item user-list-item d-flex align-items-center",
          {
            "list-group-item-secondary": isOwn
          }
        )}
      >
        
        <ClientName roomData={roomData} clientId={clientId} />
        <TransientAwareness roomData={roomData} clientId={clientId} />
      </li>
    );
  }
}
