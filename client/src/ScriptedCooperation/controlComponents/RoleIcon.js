import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import sessionTypes from "../../shared_constants/sessionTypes";
import { SessionTypeDefinitionsMapping } from "./../../ScriptedCooperation/SessionTypeDefinitionsMapping";

// displays an role icon for the given user nick
// renders null if no role was found (e.g. in non scripted sessions)
class RoleIcon extends Component {
  render() {
    const { sessionType } = this.props.sharedData.meta;

    if (sessionType === sessionTypes.SESSION_DEFAULT) return null;

    var staticRoleData = null;
    if (!(staticRoleData = SessionTypeDefinitionsMapping[sessionType].roleData))
      return;

    const ownRole = this.props.sharedData.getAtPath(
      `collabScript.roles.${this.props.nickName}`,
      null
    );

    if (!ownRole) return null;

    if (staticRoleData[ownRole] && staticRoleData[ownRole].faIcon)
      return (
        <span className="roleicon" title={ownRole==="ROLE_TUTOR"?"Du hast die Rolle des Tutors":"Du hast die Rolle des Tuties"}>
          <i className={`mr-1 fa fa-${staticRoleData[ownRole].faIcon}`} />
        </span>
      );

    return null;
  }
}

RoleIcon.propTypes = {
  nickName: PropTypes.string.isRequired,
  sharedData: PropTypes.object.isRequired // shared room data
};

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  null
)(RoleIcon);
