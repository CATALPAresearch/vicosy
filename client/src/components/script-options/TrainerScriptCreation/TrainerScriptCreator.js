import { connect, useStore } from "react-redux";
import React, { Component } from "react";
import { createTrainerSession, ownSocketId } from "../../../socket-handlers/api";
import "./TrainerScriptCreator.css";
import PropTypes from "prop-types";
import { LOG_ERROR } from "../../logic-controls/logEvents";
import {
  SESSION_DEFAULT,
  SESSION_PEER_TEACHING
} from "../../../shared_constants/sessionTypes";
import SelectListGroup1 from "../../controls/SelectListGroup1";
import InputGroup from "../../controls/InputGroup";
import InputGroupWithButton from "../../controls/InputGroupWithButton";
import { HETEROGEN, HOMOGEN, SHUFFLE } from "../../../actions/types";
import { createScript } from "../../../actions/scriptActions";

import store from "../../../store";

class TrainerScriptCreator extends Component {
  constructor(props) {
    super(props);
    this.urlInput = React.createRef();
    this.scriptTypeRef = React.createRef();

    this.state = {
      // videourl: process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   ? process.env.REACT_APP_DEFAULT_VIDEO_URL
      //   : "https://www.dropbox.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      videourl:
        "https://dl.dropboxusercontent.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      scriptName: "Meine Video Session",
      inputEdited: false,
      groupSize: 2,
      groupMix: HETEROGEN,
      themes: "",
      errors: {},
      isPhase0: false,
      isPhase5: false,
      phase0Assignment: "",
      phase5Assignment: "",
      scriptType: SESSION_PEER_TEACHING,
      userId: store.getState()

    };
    this.onChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.scriptNameUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.scriptNameUpdate(nextProps);
  }

  scriptNameUpdate(props) {
    if (this.inputEdited) return;

    try {
      const ownNick =
        props.rooms.rooms.trainerlobby.state.sharedRoomData.clients[ownSocketId()]
          .nick;
      this.setState({ scriptName: ownNick + "'s Video Session" });
    } catch (e) { }

  }

  onSubmit(e) {
    e.preventDefault();
    const newScript = {
      userId: this.state.userId.auth.user.id,
      scriptName: this.state.scriptName,
      scriptType: this.state.scriptType,
      groupSize: this.state.groupSize,
      groupMix: this.state.groupMix,
      videourl: this.state.videourl,
      themes: this.state.themes,
      isPhase0: this.state.isPhase0,
      isPhase5: this.state.isPhase5,
      phase0Assignment: this.state.phase0Assignment,
      phase5Assignment: this.state.phase5Assignment
    };
    const { userId, videourl, scriptName, scriptType, groupSize, groupMix, themes, isPhase0, isPhase5, phase0Assignment, phase5Assignment } = this.state;
    if (videourl && scriptName && themes && scriptType) {
      this.props.createScript(newScript);
      //newScript(this.state);
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
    this.setState({ [e.target.id]: e.target.value, inputEdited: true });
  }
  //Unsetting der Checkbox wird das Assignment mitgelöscht, das läuft über das name Attribut
  handleCheckboxChange(e) {
    if (!e.target.checked)
      this.setState({ [e.target.name]: "", inputEdited: true })
    this.setState({ [e.target.id]: e.target.checked, inputEdited: true })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const userId = store.getState();
    const scriptsEnabled = this.props.auth.user.name !== "Guest";
    const { errors } = this.state;
    const groupSize = [];
    const groupMix = [];
    groupSize.push({
      label: "2",
      value: "2"
    });
    groupSize.push({
      label: "3",
      value: "3"
    });
    groupSize.push({
      label: "4",
      value: "4"
    });
    groupMix.push({
      label: "Heterogen",
      value: "HETEROGEN"
    });
    groupMix.push({
      label: "Homogen",
      value: "HOMOGEN"
    });
    groupMix.push({
      label: "Zufällig",
      value: "SHUFFLE"
    });

    return (
      <form onSubmit={this.onSubmit.bind(this)} className="mb-2">
        <h1>Scripteinstellungen</h1>
        <div className="row">
          <div className="col-sm-9 border bg-light">
            <div className="row">
              <div className="col-6 col-sm-3"><h4 htmlFor="scriptName">
                Session name
          </h4></div>
              <div className="col-6 col-sm-8">
                <input
                  id="scriptName"
                  value={this.state.scriptName}
                  type="text"
                  className="form-control form-control-lg mr-sm-2"
                  placeholder="Session Name"
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="w-100"></div>
              <div className="col-6 col-sm-3">
                <h4 htmlFor="videourl">
                  Url Input
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <input
                  ref={this.urlInput}
                  id="videourl"
                  value={this.state.videourl}
                  type="text"
                  className="form-control form-control-lg mr-sm-2"
                  placeholder="Video URL"
                  onChange={this.handleChange.bind(this)}
                />
                <input
                  type="button"
                  className="btn btn-outline-secondary mr-sm-2"
                  value="Clear"
                  onClick={this.onClearUrl.bind(this)}
                />
              </div>

              <div className="w-100"></div>

              <div className="col-6 col-sm-3"><h4 htmlFor="scriptName">
                Sessiontyp
            </h4>
              </div>

              <div className="col-6 col-sm-8">
                <select id="scriptType" type="select" ref={this.scriptTypeRef} className="form-control mr-sm-2"
                  onChange={this.handleChange.bind(this)}
                >
                  <option
                    value={SESSION_PEER_TEACHING}
                    title={
                      scriptsEnabled
                        ? "Controlled learning via collaboration script 'Peer teaching'. Description... Required peers: 2"
                        : "Not available for guest accounts"
                    }
                    disabled={!scriptsEnabled}
                  >
                    Scripted Peer Teaching
            </option>
                  <option
                    value={SESSION_DEFAULT}
                    title="Uncontrolled video conversation without member limit."
                  >
                    Default Video Conversation
            </option>
                </select>
              </div>
              <div className="w-100"></div>

              <div className="col-6 col-sm-3">
                <h4 htmlFor="isPhase0">
                  Vorstellungsphase erwünscht
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <InputGroupWithButton
                  name="isPhase0"
                  idCheckbox="isPhase0"
                  idTextfield="phase0Assignment"
                  errors={errors}
                  value={this.state.phase0Assignment}
                  onChange={this.handleChange.bind(this)}
                  onCheckboxChange={this.handleCheckboxChange.bind(this)}
                  placeholder="Gib hier den Arbeitsauftag ein!"
                  disabled={true}

                />
              </div>
              <div className="w-100"></div>


              <div className="col-6 col-sm-3">
                <h4 htmlFor="isPhase5">
                  Arbeitsauftrag Vertiefung
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <InputGroupWithButton
                  name="isPhase5"
                  idCheckbox="isPhase5"
                  idTextfield="phase5Assignment"
                  value={this.state.phase5Assignment}
                  placeholder="Gib hier den Arbeitsauftag ein!"
                  errors={errors}
                  onChange={this.handleChange.bind(this)}
                  onCheckboxChange={this.handleCheckboxChange.bind(this)}
                  disabled={true}

                />
              </div>
              <div className="w-100"></div>
              <div className="col-6 col-sm-3">
                <h4 htmlFor="gruppengroesse">
                  Gruppengröße
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <SelectListGroup1
                  id="groupSize"
                  name="groupSize"
                  options={groupSize}
                  errors={errors}
                  onChange={this.handleChange.bind(this)}
                  role={this.state.role}
                  valueProvider={this.state}
                />
              </div>
              <div className="w-100"></div>
              <div className="col-6 col-sm-3">
                <h4 htmlFor="gruppengroesse">
                  Gruppenmix
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <SelectListGroup1
                  id="groupMix"
                  name="groupMix"
                  options={groupMix}
                  errors={errors}
                  onChange={this.handleChange.bind(this)}
                  valueProvider={this.state}
                />
              </div>
              <div className="w-100"></div>
              <div className="col-6 col-sm-3">
                <h4 htmlFor="themes" title="Lerner werden gefragt, wieviel sie auf einer Skala von 1-10 zum Thema wissen">
                  Themen
                </h4>
              </div>
              <div className="col-6 col-sm-8">
                <input
                  name="themes"
                  id="themes"
                  placeholder="Hier Themen des Videos zur Ermittlung des Vorwissens eingeben."
                  errors={errors}
                  className="form-control form-control-lg mr-sm-2"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.themes}
                />
              </div>
            </div>







            <input
              type="submit"
              className="btn btn-info btn-lg"
              value="Create Session"
            />



          </div>
          <div className="col-sm-3 border bg-light">

          </div>
        </div>


      </form>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth,
  errors: state.errors,
  var: state
});


TrainerScriptCreator.propTypes = {
  errors: PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  { createScript },
  null
)(TrainerScriptCreator);


// auth state into props => this.props.auth
// map prop var to reducer
/*
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
*/