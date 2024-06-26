import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendRoleReadyState } from "../../socket-handlers/api";
import ToggleSwitchButton from "../../components/controls/ToggleSwitchButton";
import { updateContinueButton } from "../../actions/assistentActions";
import {logDocs} from "../../actions/docActions";
import "./script-components.css";
import HintArrow from "./../../components/Assistent/HintArrow";
import OkButton from "./OkButton";

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
    this.props.updateContinueButton(false, false, false);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    const { collabScript } = props.sessionData
      ? props.sessionData
      : props.rooms.rooms[props.sessionId].state.sharedRoomData;

    if (!collabScript.roles) {

      this.setState({
        meIsRequired: false,
        meIsReady: false,
        waitingForOthers: false
      });

      this.props.updateContinueButton(false, false, false);

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
    if (meIsRequired !== this.state.meIsRequired || meIsReady !== this.state.meIsReady || waitingForOthers !== this.state.waitingForOthers)
      this.props.updateContinueButton(meIsRequired, meIsReady, waitingForOthers);

    this.setState({ meIsRequired, meIsReady, waitingForOthers });

  }

  onButtonClick(e) {
    sendRoleReadyState(!this.state.meIsReady);
    this.props.logDocs(this.props.auth.user.id, this.props.script._id, this.props.docs);

  }

  render() {
    const divStyle = {
     zIndex: "30",
    position: "relative"};
    var targetContent = null;
    const continueContent = (
      <div style={divStyle} id="ready-to-finish" className="ml-1">
        {this.state.waitingForOthers ? (
          <div className="hFlexLayout" id="toggle-switch">
            {this.state.meIsReady ? (
              <span className="mr-1"></span>
            ) : null}
            <ToggleSwitchButton
              onToggle={this.onButtonClick}
              isChecked={this.state.meIsReady}
              label="Nächste Phase"
             
            />
          </div>
        ) : (
          <div>
            <OkButton style={divStyle}
              onButtonClick={this.onButtonClick}
              className="btn primaryCol btn-sm"
            >
             
            </OkButton>
            </div>
          )}
           { /*
           this.props.assistent.actInstruction?this.props.assistent.active && (this.props.assistent.actInstruction.markers === "ok-understand" || this.props.assistent.actInstruction.markers === "ready-to-finish") ?
                <HintArrow
                  style={{ position: "absolute", marginTop: 10, marginLeft: 60, zIndex: 1000 }}
                  direction="up"
                /> : null:null}
              {this.props.assistent.incomingInstruction ?
                this.props.assistent.incomingInstruction.markers === "toggle-switch" ?
                  <HintArrow
                    style={{ position: "absolute", marginTop: 10, marginLeft: 60, zIndex: 1000 }}
                    direction="up"
              /> : null : null*/}
      </div>
    );

    if (this.state.meIsReady && !this.state.waitingForOthers)
      targetContent = null;
    else if (this.state.meIsRequired) targetContent = continueContent;
    else if (this.state.waitingForOthers)
      /*targetContent = (
        <div id="ready-to-finish" className="ml-1">Waiting for peer to continue...</div>
      ); */
      targetContent=null;

    return targetContent;
  }
}

// provide session data or room id
ReadyContinueScriptButton.propTypes = {
  sessionData: PropTypes.object,
  sessionId: PropTypes.string
};

const mapStateToProps = state => ({
  auth: state.auth,
  rooms: state.rooms,
  docs: state.docs,
  script: state.script
});

export default connect(
  mapStateToProps, { updateContinueButton, logDocs },
  null
)(ReadyContinueScriptButton);
