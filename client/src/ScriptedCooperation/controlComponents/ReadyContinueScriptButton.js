import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendRoleReadyState } from "../../socket-handlers/api";
import ToggleSwitchButton from "../../components/controls/ToggleSwitchButton";

/**
 * displays a button based on the states of the roles
 * sets the ready state for the own role on click
 *
 * displays as a toggle if: readyRequiredRoles has entries with roles in not ready state other than me
 * displays as a button if: readyRequiredRoles is null or all other roles beside me are in ready state
 */
class ReadyContinueScriptButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meIsRequired: false,
      meIsReady: false,
      waitingForOthers: false
    };

    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    const { collabScript } = props.sessionData;

    if (!collabScript.roles) {
      this.setState({
        meIsRequired: false,
        meIsReady: false,
        waitingForOthers: false
      });
      return;
    }

    const ownRole = collabScript.roles[props.auth.user.name];
    const requiredRoles = collabScript.phaseData.rolesReady;

    var meIsRequired = false;
    var meIsReady = false;
    var waitingForOthers = false;

    if (requiredRoles) {
      const roleNames = Object.keys(requiredRoles);
      for (let i = 0; i < roleNames.length; i++) {
        const role = roleNames[i];
        if (ownRole === role) {
          meIsRequired = true;
          meIsReady = requiredRoles[role];
        } else if (!waitingForOthers) {
          waitingForOthers = !requiredRoles[role];
        }
      }
    }

    this.setState({ meIsRequired, meIsReady, waitingForOthers });
  }

  onButtonClick(e) {
    sendRoleReadyState(!this.state.meIsReady);
  }

  render() {
    var targetContent = null;
    const continueContent = (
      <div className="ml-1">
        {this.state.waitingForOthers ? (
          <ToggleSwitchButton
            onToggle={this.onButtonClick}
            isChecked={this.state.meIsReady}
            label="Ready"
          />
        ) : (
          <button
            onClick={this.onButtonClick}
            className="btn btn-success btn-sm"
          >
            Continue
          </button>
        )}
      </div>
    );

    if (this.state.meIsReady && !this.state.waitingForOthers)
      targetContent = null;
    else if (this.state.meIsRequired) targetContent = continueContent;
    else if (this.state.waitingForOthers)
      targetContent = <div className="ml-1">Waiting for others</div>;

    return targetContent;
  }
}

ReadyContinueScriptButton.propTypes = {
  sessionData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  null
)(ReadyContinueScriptButton);
