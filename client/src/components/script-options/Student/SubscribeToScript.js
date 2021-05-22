import React, { Component } from "react";
import { connect} from "react-redux";
import { getScriptById, subScribeToScript } from "../../../actions/scriptActions";
import SelectListGroup1 from "../../controls/SelectListGroup1";
import "./SubscribeToScript.css";

class SubscribeToScript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      script: {},
      expLevel: ""
    };
    this.props.getScriptById(
      this.props.match.params.scriptId)
    if (!this.props.auth.isAuthenticated)
      this.props.history.push("/login?" + this.props.match.params.scriptId);

  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value, inputEdited: true });
  }

  toStudentLobby() {
    this.props.history.push("/studentlobby");
  }
  onSubmit(e) {

    this.props.subScribeToScript(this.props.auth.user.id, this.props.auth.user.name, this.state.expLevel, this.props.script._id, this.props.auth.user.role, this.toStudentLobby.bind(this));

  }
  render() {
    const expLevel = [];
    expLevel.push({
      label: "Wählen",
      value: ""
    });
    for (var i = 1; i < 11; i++)
      expLevel.push({
        label: i,
        value: i
      });

    return (
      <div id="subscribetoscript" className="container mt-4" >
        {/*  <form onSubmit={this.onSubmit.bind(this)} className="mb-2">*/}
        <h2>Anmeldung für das Script: {this.props.script.scriptName} </h2>
        Bevor du dich für das Script anmelden kannst, beantworte die Frage mit Hilfe der Skala.<br>
        </br> <br></br>
        <h5>{this.props.script.themes}</h5>
        <br></br>
        <SelectListGroup1
          id="expLevel"
          name="expLevel"
          options={expLevel}
          errors={this.props.errors}
          onChange={this.handleChange.bind(this)}
          valueProvider={this.state}
        />

        <input
          type="submit"
          className="btn primaryCol btn-lg"
          value="Einschreiben"
          onClick={this.onSubmit.bind(this)}
          errors={this.props.errors}
        />
        {/* </form> */}
      </div>
    );
  }

}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth,
  errors: state.errors,
  script: state.script,
  var: state
});

export default connect(
  mapStateToProps,
  { getScriptById, subScribeToScript },
  null
)(SubscribeToScript);