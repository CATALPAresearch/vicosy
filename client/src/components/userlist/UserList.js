import React, { Component } from "react";
import RoomComponent from "../controls/RoomComponent";
import ClientCounter from "../controls/ClientCounter";

export default class UserList extends Component {
  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var clients = null;
    var UserListItem = this.props.userListItemComponent;

    if (roomAvailable && roomData.state.sharedRoomData) {
      var clientIdArray = Object.keys(roomData.state.sharedRoomData.clients);
      clients = clientIdArray.map(clientId => {
        return (
          <UserListItem
            key={clientId}
            clientId={clientId}
            roomData={roomData}
          />
        );
      });
    }

    return (
      <div className="userlist-main bg-dark">
        <p className="h6 text-light ml-2 bg-dark">
          Users{" "}
          <RoomComponent
            component={ClientCounter}
            roomId={this.props.roomId}
            badgeClass="badge badge-secondary"
          />
        </p>
        <div className="userlist-wrapper">
          <ul className="list-group text-dark ml-2 mr-2 mb-2">{clients}</ul>
        </div>
      </div>
    );
  }
}
