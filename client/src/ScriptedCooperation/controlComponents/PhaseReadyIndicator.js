import React, { Component } from "react";
import "./script-components.css";
import sessionTypes from "../../shared_constants/sessionTypes";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

class PhaseReadyIndicator extends Component {
  render() {
    const { sessionType } = this.props.sharedData.meta;

    if (sessionType === sessionTypes.SESSION_DEFAULT) return null;

    const clientData = this.props.sharedData.clients[this.props.clientId];

    if (!clientData) return null;

    const ownRole = this.props.sharedData.getAtPath(
      `collabScript.roles.${clientData.nick}`,
      null
    );

    if (!ownRole) return null;

    const ownReady = !!this.props.sharedData.getAtPath(
      `collabScript.phaseData.rolesReady.${ownRole}`,
      true
    );

    // if (staticRoleData[ownRole] && staticRoleData[ownRole].faIcon)
    return (
      <span className="phase-ready-indicator">
        <i
          className={classnames("fa", {
            "fa-check-circle color-ready": ownReady,
            "fa-hourglass color-waiting": !ownReady
          })}
            title={ownReady?"Phase abgeschlossen":"Phase wird noch bearbeitet"}
        />{" "}
      </span>
    );

    return null;
  }
}

PhaseReadyIndicator.propTypes = {
  clientId: PropTypes.string.isRequired,
  sharedData: PropTypes.object.isRequired // shared room data
};

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  null
)(PhaseReadyIndicator);
