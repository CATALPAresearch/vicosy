import React, { Component } from "react";
import Chat from "../chat/Chat";
import { connect } from "react-redux";
import RoomComponent from "../controls/RoomComponent";
import SessionList from "../video-session/TrainerSessionList";
import UserList from "../userlist/UserList";
import UserListItemDefault from "../userlist/UserListItemDefault";
import "./StudentLobby.css";
import Logger from "../logic-controls/Logger";
import PhaseController from "../Assistent/PhaseController";

import { STUDENTLOBBY } from "../Assistent/phases/types";


export class StudentLobby extends Component {
  constructor() {
    super();
    this.assistentControlRef = null;
  }
  componentDidMount() {
    this.assistentControlRef.setPhase(STUDENTLOBBY);
  }

  render() {
    return (
      <div id="studentlobby" className="container mt-4">
        <PhaseController createRef={el => (this.assistentControlRef = el)} />
        <Logger roomId="studentlobby" />
        <h1>Studentlobby</h1>
        <RoomComponent roomId="studentlobby" component={SessionList} />

        {/*<SessionCreator />*/}

        <div className="lobby-chat">
          <RoomComponent roomId="studentlobby" component={Chat} />
          <RoomComponent
            roomId="studentlobby"
            component={UserList}
            userListItemComponent={UserListItemDefault}
          />


        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  assistent: state.assistent  
});

export default connect(
  mapStateToProps)(StudentLobby);

