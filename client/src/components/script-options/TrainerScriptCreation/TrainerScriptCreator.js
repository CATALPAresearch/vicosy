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
import { updateScriptProp, createScript, updateScript,  getScriptById } from "../../../actions/scriptActions";
import isEmpty from "../../controls/is-empty";
import store from "../../../store";
import Members from "../Members";


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
      _id: "",
      videourl:
        "https://dl.dropboxusercontent.com/s/qiz6f29vv0241f2/Euro_360.mp4?dl=0",
      scriptName: "Mein Videoscript",
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
      userId: store.getState(),
      showUrl: false,
      scriptUrl: ""

    };
    this.onChange = this.handleChange.bind(this);
    this.setScript = this.setScript.bind(this);
    this.props.updateScriptProp({ userId: this.props.auth.user.id })
    //gets Script if ID in URL-Params
    this.setScript();
      }

  componentDidMount() {
    this.scriptNameUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.scriptNameUpdate(nextProps);
  }

  scriptHasId() {
    if (isEmpty(this.props.script._id))
      return false;
    else
      return true;
  }
  showSaveMessageDelay() {
    this.setState({ showSaveMessage: true })
    setTimeout(() => this.setState({ showSaveMessage: false }), 2000);


  }

  scriptNameUpdate(props) {
    if (this.inputEdited) return;

    try {
      const ownNick =
        props.rooms.rooms.trainerlobby.state.sharedRoomData.clients[ownSocketId()]
          .nick;
      this.setState({ scriptName: ownNick + "'s Video Script" });
    } catch (e) { }

  }

  setScript() {

    if (this.props.location.search) {
      this.props.getScriptById(this.props.location.search.replace('?', ''));
    }
  }

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
      phase5Assignment: this.props.script.phase5Assignment
    };

    const { _id, userId, videourl, scriptName, scriptType, groupSize, groupMix, themes, isPhase0, isPhase5, phase0Assignment, phase5Assignment } = this.props.script;
    if (/*videourl && scriptName && themes && scriptType*/true) {
      if (!this.state._id) {
        console.log("new Script");
        this.props.createScript(newScript, script => this.props.history.push({
          search: '?' + script._id
        }));

      }
      else {
        console.log("update Script");
        this.props.updateScript(newScript);
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

  onChange(e) {
    this.props.updateScriptProp({ [e.target.name]: e.target.value });
  }
  showUrl() {
    let urlprocessed = "";
    let url = window.location.href.replace(window.location.pathname, "")
    if (url.charAt(url.length - 1) == "#")
      url = url.substring(0, url.length - 1);
    if (url.includes("?")) {
      let parts = url.split("?");

      urlprocessed = parts[0];

    }
    else urlprocessed = url;

    this.setState({ scriptUrl: urlprocessed + "/subcribeToScript/" + this.props.script._id });
    this.setState({ showUrl: true });
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
    /*
    groupSize.push({
      label: "3",
      value: "3"
    });
    groupSize.push({
      label: "4",
      value: "4"
    });
    */
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
        {/*         <div className="alert alert-danger hide" role="alert">
        </div> */}
        {this.state.showUrl ?
          <div className="alert alert-primary" role="alert">
            Schicke die URL Teilnehmern für das Script: <br></br>
            <a href={this.state.scriptUrl}>
              {this.state.scriptUrl}<br></br>
            </a>

          </div> : null
        }
        <div className="row">
          <div className="col-sm-9 border bg-light">
            <div className="row">
              <div className="col-6 col-sm-3"><h4 htmlFor="scriptName">
                Script name
          </h4></div>
              <div className="col-6 col-sm-8">
                <input
                  id="scriptName"
                  value={this.props.script.scriptName}
                  type="text"
                  className="form-control form-control-lg mr-sm-2"
                  placeholder="Script Name"
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
                  ref={this.props.script.urlInput}
                  id="videourl"
                  value={this.props.script.videourl}
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
                Scripttyp
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
                  value={this.props.script.phase0Assignment}
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
                  value={this.props.script.phase5Assignment}
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
                  valueProvider={this.props.script}
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
                  valueProvider={this.props.script}
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
                  value={this.props.script.themes}
                />
              </div>
            </div>


            <input
              type="submit"
              className="btn btn-info btn-lg"
              value="Speichere Script"
            />
            {
              this.state.showSaveMessage ?
                <div className="alert alert-success" role="alert">Script gespeichert</div> : null
            }
          </div>

          

          <div className="col-sm-3 border bg-light">
            <h1>Teilnehmer</h1>
            {

              this.scriptHasId() ?
                <Members
                  _id={this.props.script._id}
                  showUrl={this.showUrl.bind(this)}
                /> : null
            }

          </div>

        </div>


      </form>
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
  { createScript, updateScript, updateScriptProp, getScriptById},
  null
)(TrainerScriptCreator);

