import React, { Component } from "react";
import Chat from "../chat/Chat";
import RoomComponent from "../controls/RoomComponent";
import TrainerSessionCreator from "../video-session/TrainerSessionCreation/TrainerSessionCreator";
import TrainerSessionList from "../video-session/TrainerSessionList";
import UserList from "../userlist/UserList";
import UserListItemDefault from "../userlist/UserListItemDefault";
import "./TrainerLobby.css";
import Logger from "../logic-controls/Logger";

export default class TrainerLobby extends Component {
  render() {
    return (
      <div className="container mt-4">
        <Logger roomId="trainerlobby" />
        <h1>Trainerlobby</h1>
        {<RoomComponent roomId="trainerlobby" component={TrainerSessionList} />}
        {/*<TrainerSessionCreator />*/}
        {
          /*
        <div className="lobby-chat">
          <RoomComponent roomId="trainerlobby" component={Chat} />
          <RoomComponent
            roomId="trainerlobby"
            component={UserList}
            userListItemComponent={UserListItemDefault}
          />
        </div>
        */
        }
      </div>
    );
  }
}
