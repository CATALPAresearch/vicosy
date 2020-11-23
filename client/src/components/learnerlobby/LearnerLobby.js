import React, { Component } from "react";
import Chat from "../chat/Chat";
import RoomComponent from "../controls/RoomComponent";
import SessionCreator from "../video-session/SessionCreation/SessionCreator";
import SessionList from "../video-session/SessionList";
import UserList from "../userlist/UserList";
import UserListItemDefault from "../userlist/UserListItemDefault";
import "./LearnerLobby.css";
import Logger from "../logic-controls/Logger";

export default class LearnerLobby extends Component {
  render() {
    return (
      <div className="container mt-4">
        <Logger roomId="learnerlobby" />
        <h1>Lernerlobby</h1>
        <RoomComponent roomId="learnerlobby" component={SessionList} />
        <SessionCreator />

        <div className="lobby-chat">
          <RoomComponent roomId="learnerlobby" component={Chat} />
          <RoomComponent
            roomId="learnerlobby"
            component={UserList}
            userListItemComponent={UserListItemDefault}
          />
        </div>
      </div>
    );
  }
}
