import React, { Component } from "react";
import { getScriptMembers } from "../../../actions/scriptActions"
import { connect } from "react-redux";
import MemberListItem from "./MemberListItemDefault";

export class GroupMemberList extends Component {

  render() {

    var group = Object.values(this.props.group);

    if (group[1]) {
      var members = group[1].map(member => {
       
        return (
          <MemberListItem
            clientId={member._id}
            expLevel={member.expLevel}
            name={member.name}
            key={member._id + "group"}
          />
        );
      }
      )
    }
    return (
      group[1]?group[1].length>0?
      <div className="userlist-main bg-dark pt-1">
        <div className="userlist-wrapper">
          <ul className="list-group text-dark ml-2 mr-2 mb-2">{members}</ul>
        </div>
      </div>:null:null
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
)(GroupMemberList);
