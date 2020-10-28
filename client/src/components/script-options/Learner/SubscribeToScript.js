import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import RoomComponent from "../../controls/RoomComponent";
import { connect, useStore } from "react-redux";
import { getScriptById } from "../../../actions/scriptActions";
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
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value, inputEdited: true });
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
      <div className="container mt-4" >
        <h2>Anmeldung für das Script: {this.props.script.scriptName} </h2>
        Bevor du dich für das Script anmelden kannst, noch eine Frage. Auf einer Skala von 1-10, wie gut schätzt du deine Kenntnisse zu folgendem Thema ein, wobei 1 für sehr gering und 10 für überragend steht.: <br>
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
          className="btn btn-info btn-lg"
          value="Einschreiben"
        />
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
  { getScriptById },
  null
)(SubscribeToScript);