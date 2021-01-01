import React, { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { setPhase, setActInstruction } from "../../actions/assistentActions";
import { connect } from "react-redux";
import { GetTogether } from "./phases/GetTogether";

class AssistentController extends Component {
  constructor() {
    super();
    this.state = { phase: {} };
  }
  render() {
    console.log(this.state);
    return null;


  }

  componentDidMount() {
    this.props.createRef(this);
  }

  setPhase(phase) {
    var phase0 = new GetTogether();
    this.setState({ phase: phase0 })
    this.props.setPhase(phase);
    alert(phase);
    
    this.props.setActInstruction(phase0.getActInstruction());

  }  // public
  openGuide(publicUrl, confirmationMode = "simple") {
    this.props.openPublicGuide(publicUrl, confirmationMode);
  }
}


const mapStateToProps = state => ({
  assistent: state.assistent
});


export default connect(
  mapStateToProps,
  { openPublicGuide, closePublicGuide, setPhase, setActInstruction }
)(AssistentController);


