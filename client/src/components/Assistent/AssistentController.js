import React, { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { setPhase, setActInstruction } from "../../actions/assistentActions";
import { connect } from "react-redux";
import { GetTogether } from "./phases/GetTogether";
import { WarmUp } from "./phases/WarmUp";

export class AssistentController extends Component {
  constructor() {
    super();
    this.state = { phase: {} };
  }

  getActInstruction() {
    if (this.props.assistent.phase.instructions[this.props.assistent.phase.pointer])
      return this.props.assistent.phase.instructions[this.props.assistent.phase.pointer];
    else return null;
  }
  render() {
    console.log(this.state);
    return null;


  }

  componentDidMount() {
    this.props.createRef(this);
  }



  setPhase(phase) {
    var actPhase = {};
    switch (phase) {
      case "GETTOGETHER":
        actPhase = new GetTogether();
        this.setState({ phase: actPhase });
        break;
      case "WARMUP":
        actPhase = new WarmUp();
        this.setState({ phase: actPhase });
        break;
      default:
        break;
    }

    this.props.setPhase(actPhase);
    console.log(this.state);
    //this.props.setActInstruction(actPhase.getActInstruction());

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


