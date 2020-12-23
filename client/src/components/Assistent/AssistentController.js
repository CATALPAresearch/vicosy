import React, { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { connect } from "react-redux";

class AssistentController extends Component {
  render() {
    return null;
  }

  componentDidMount() {
    this.props.createRef(this);
  }

  setPhase (phase) 
 {
   alert(phase);
 }  // public
  openGuide(publicUrl, confirmationMode = "simple") {
    this.props.openPublicGuide(publicUrl, confirmationMode);
  }
}

export default connect(
  null,
  { openPublicGuide, closePublicGuide }
)(AssistentController);
