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
      this.props.match.params.scriptId, this.setScript)
    this.setScript = this.setScript.bind(this);
  }

  componentDidMount() {

  }
  setScript(fetchedscript) {
    //this.setState({ script: fetchedscript.script })
    console.log(fetchedscript);
  }
  render() {
    return (
      <div className="container mt-4" >
        {this.state.script.scriptName}
      </div>
    );
  }

}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth,
  errors: state.errors,
  var: state
});

export default connect(
  mapStateToProps,
  { getScriptById },
  null
)(SubscribeToScript);

