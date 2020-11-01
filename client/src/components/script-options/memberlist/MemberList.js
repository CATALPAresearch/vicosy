import React, { Component } from "react";
import RoomComponent from "../../controls/RoomComponent";
import ClientCounter from "../../controls/ClientCounter";
import { getScriptMembers } from "../../../actions/scriptActions"

export default class MemberList extends Component {
  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    console.log(roomData);
    var clients = null;
    var MemberListItem = this.props.memberListItemComponent;
    console.log(roomData);
    getScriptMembers(this.props.script_id);
    if (roomAvailable && roomData.state.sharedRoomData) {
      var clientIdArray = Object.keys(roomData.state.sharedRoomData.clients);
      clients = clientIdArray.map(clientId => {
        return (
          <MemberListItem
            key={clientId}
            clientId={clientId}
            roomData={roomData}
          />
        );
      });
    }

    return (
      <div className="userlist-main bg-dark pt-1">
        {/* <p className="h6 text-light ml-2 bg-dark">
          Users{" "}
          <RoomComponent
            component={ClientCounter}
            roomId={this.props.roomId}
            badgeClass="badge badge-secondary"
          />
        </p> */}
        <div className="userlist-wrapper">
          <ul className="list-group text-dark ml-2 mr-2 mb-2">{clients}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth,
  script: state.script,
  errors: state.errors,
  var: state
});

