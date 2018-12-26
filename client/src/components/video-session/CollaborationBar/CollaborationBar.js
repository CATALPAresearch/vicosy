import React, { Component } from "react";
import "./CollaborationBar.css";
import ClientCooperationProcessor from "../../../ScriptedCooperation/ClientCooperationProcessor";

export default class CollaborationBar extends Component {
  render() {
    return (
      <div id="CollaborationBar">
        <ClientCooperationProcessor sessionData={this.props.sharedRoomData} />
      </div>
    );
  }
}
