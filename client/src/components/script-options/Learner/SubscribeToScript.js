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

class SubscribeToScript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      script: {}
    };
    this.props.getScriptById(
      this.props.match.params.scriptId)
 }
  
  render() {
    return (
      <div className="container mt-4" >
        {this.props.script.scriptName}
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