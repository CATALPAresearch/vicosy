import React, { Component } from "react";
import RoomComponent from "../../controls/RoomComponent";
import ClientCounter from "../../controls/ClientCounter";
import { getScriptMembers } from "../../../actions/scriptActions"
import { connect, useStore } from "react-redux";

export class MemberList extends Component {
  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var clients = null;
    var MemberListItem = this.props.memberListItemComponent;
    this.props.getScriptMembers(this.props.script._id, this.props.auth.user.id);
    if (roomAvailable) {
      var clientIdArray = this.props.script.participants;
      clients = clientIdArray.map(client => {

        return (
          <MemberListItem
            key={client._id}
            clientId={client._id}
            name={client.name}
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


export default connect(
  mapStateToProps,
  { getScriptMembers },
  null
)(MemberList);
