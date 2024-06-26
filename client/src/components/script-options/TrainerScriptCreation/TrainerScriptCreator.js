import { connect } from "react-redux";
import React, { Component } from "react";
import { ownSocketId } from "../../../socket-handlers/api";
import "./TrainerScriptCreator.css";
import PropTypes from "prop-types";
import { LOG_ERROR } from "../../logic-controls/logEvents";
import {

  SESSION_PEER_TEACHING
} from "../../../shared_constants/sessionTypes";
import { updateScriptProp, createScript, updateScript, getScriptById, mixGroups, deleteAllScripts, startScript } from "../../../actions/scriptActions";
import { clearError } from "../../../actions/errorActions"
import isEmpty from "../../controls/is-empty";
import store from "../../../store";
import Members from "./Members";
import ScriptSettings from "./ScriptSettings";


class TrainerScriptCreator extends Component {
  constructor(props) {
    super(props);
    this.urlInput = React.createRef();
    this.scriptTypeRef = React.createRef();

    this.state = {
      // videourl: process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   ? process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   : "https://www.dropbox.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      showSavemessage: false,
      inputEdited: false,
      errors: {},
      scriptType: SESSION_PEER_TEACHING,
      userId: store.getState(),
      scriptUrl: "",
      settings: true,
      settingsClassname: "nav-link active",
      groupClassname: "nav-link"

    };
    this.onChange = this.handleChange.bind(this);
    this.setScript = this.setScript.bind(this);
    this.changeToGroups = this.changeToGroups.bind(this);
    this.props.updateScriptProp({ userId: this.props.auth.user.id })
    //gets Script if ID in URL-Params
    this.setScript();

  }

  componentDidMount() {
    this.scriptNameUpdate(this.props);
  }

  //clears errors
  clearErrors() {
    this.props.clearError("scriptName");
    this.props.clearError("videourl");
    this.props.clearError("themes");

  }

  componentWillReceiveProps(nextProps) {
    this.scriptNameUpdate(nextProps);
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
//if script is already with id in db
  scriptHasId() {
    if (isEmpty(this.props.script._id))
      return false;
    else
      return true;
  }


//updates the name of the script
  scriptNameUpdate(props) {
    if (this.inputEdited) return;

    try {
      const ownNick =
        props.rooms.rooms.trainerlobby.state.sharedRoomData.clients[ownSocketId()]
          .nick;
      this.setState({ scriptName: ownNick + "'s Video Script" });
    } catch (e) { }

  }

//sets script
  setScript() {

    if (this.props.location.search) {
      this.props.getScriptById(this.props.location.search.replace('?', ''));


    }
    else {
      this.props.deleteAllScripts();
    }
  }

  //changes view
  changeToGroups() {

    this.setState({ settings: false });
    this.unsetSettings();
  };

  //starts script, not editable afterwards
  startScript() {
    this.props.startScript(this.props.script);
  }

  //checks if script is startable
  scriptStartable() {
    if (!this.props.script.participants)
      return false;
    else
      if (this.props.script.participants.length < this.props.script.groupSize)
        return false;
      else {
        if (!this.props.script.groups)
          return false;
        else {
          let groupMembers = 0;
          for (let group of this.props.script.groups)
            groupMembers += group.groupMembers.length;
          if (groupMembers < this.props.script.participants.length)
            return false;
          else return true;
        }




      }

  }

  //creates or updates script
  onSubmit(e) {

    e.preventDefault();
    const newScript = {
      _id: this.props.script._id,
      userId: this.props.auth.user.id,
      scriptName: this.props.script.scriptName,
      scriptType: this.props.script.scriptType,
      groupSize: this.props.script.groupSize,
      groupMix: this.props.script.groupMix,
      videourl: this.props.script.videourl,
      themes: this.props.script.themes,
      isPhase0: this.props.script.isPhase0,
      isPhase5: this.props.script.isPhase5,
      phase0Assignment: this.props.script.phase0Assignment,
      phase5Assignment: this.props.script.phase5Assignment,

    };

    if (/*videourl && scriptName && themes && scriptType*/true) {
      if (!this.props.script._id) {
        console.log("new Script");
        // this.showSaveMessageDelay();

        this.props.createScript(newScript, script => this.props.history.push({
          search: '?' + script._id
        }), this.changeToGroups, () => {
          this.setState({ showSaveMessage: true });
          this.clearErrors();
          setTimeout(() => this.setState({ showSaveMessage: false }), 2000);
        });

      }
      else {
        if (!isEmpty(this.props.script.participants))
          newScript.participants = this.props.script.participants;
        if (!isEmpty(this.props.script.groups))
          newScript.groups = this.props.script.groups
        console.log("update Script");
        this.props.updateScript(newScript, () => {
          this.setState({ showSaveMessage: true });
          this.clearErrors();
          setTimeout(() => this.setState({ showSaveMessage: false }), 2000);
        });

      }
    } else {
      window.logEvents.dispatch(LOG_ERROR, {
        message: `Enter valid script name and video url (currently only youtube supported)`
      }

      );

    }


  }


  onClearUrl() {
    this.setState({ videourl: "" });
    this.urlInput.current.focus();
  }
  //Änderungen werden im State gespeichert 
  handleChange(e) {
    this.props.updateScriptProp({ [e.target.id]: e.target.value, inputEdited: true });
  }
  //Unsetting der Checkbox wird das Assignment mitgelöscht, das läuft über das name Attribut
  handleCheckboxChange(e) {
    if (!e.target.checked)
      this.props.updateScriptProp({ [e.target.name]: "", inputEdited: true })
    this.props.updateScriptProp({ [e.target.id]: e.target.checked, inputEdited: true })
  }
  onClickMix(e) {
    this.props.mixGroups(this.props.script.groupMix, this.props.script.participants, this.props.script.groupSize);

  }
  onChange(e) {
    this.props.updateScriptProp({ [e.target.name]: e.target.value });
  }


  setSettings() {
    this.setState({ settings: true });
    this.setState({ settingsClassname: "nav-link active" })
    this.setState({ groupClassname: "nav-link" })
  }

  unsetSettings() {
    this.setState({ settings: false });

    this.setState({ settingsClassname: "nav-link" })
    this.setState({ groupClassname: "nav-link active" })
  }
  render() {
    return (


      <div className="mb-2" id="trainerscriptcreator">
        <ul className="nav nav-tabs">
          <li className="nav-item inner-shadow-black">
            <a className={this.state.settingsClassname} onClick={this.setSettings.bind(this)}><h4>Scripteinstellungen</h4></a>
          </li>
          <li className="nav-item inner-shadow-black">
            <a className={this.state.groupClassname} onClick={this.unsetSettings.bind(this)}><h4>Teilnehmer</h4></a>
          </li>

        </ul>
        {this.state.settings ?
          <ScriptSettings

          ></ScriptSettings> : <Members
            _id={this.props.script._id}
          />
        }

        <div className="row">
          <div className="col">
            <br></br>
            {!this.props.script.started ?
              <button
                type="submit"
                className="btn primaryCol btn-lg"
                onClick={this.onSubmit.bind(this)}
              >
                Speichere Script
            </button> : null
            }
            {
              this.state.showSaveMessage ?
                <div className="alert alert-success" role="alert">Script gespeichert</div> : null
            }
          </div>
          {
            this.props.script._id && !this.props.script.started ?
              <div className="col">
                <br></br>
                {this.scriptStartable() ?
                  <button
                    type="submit"
                    className="btn primaryCol btn-lg"
                    onClick={this.startScript.bind(this)}
                  >
                    Starte Script
                </button> : null
                }

              </div> : null
          }
        </div>
      </div >

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


TrainerScriptCreator.propTypes = {
  errors: PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  { startScript, createScript, updateScript, updateScriptProp, getScriptById, mixGroups, deleteAllScripts, clearError },
  null
)(TrainerScriptCreator);

