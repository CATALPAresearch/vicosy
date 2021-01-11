import React, { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { setPhase, setActInstruction } from "../../actions/assistentActions";
import { connect } from "react-redux";
import { GetTogether, WarmUp, SeparateSectionsTutee, SeparateSectionsTutor, DeepenTutor, DeepenTutee, Reflexion } from "./phases/Phases";


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
    console.log(this.props.assistent);
    return null;


  }

  componentDidMount() {
    this.props.createRef(this);
  }



  setPhase(phase) {
   // alert(phase);
    var actPhase = {};
    switch (phase) {
      case "GETTOGETHER":
        actPhase = new GetTogether();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;
      case "WARMUP":
        actPhase = new WarmUp();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;
      case "SEPERATESECTIONSTUTOR":
        actPhase = new SeparateSectionsTutor();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;
      case "SEPERATESECTIONSTUTEE":
        actPhase = new SeparateSectionsTutee();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;

      case "DEEPENTUTOR":
        actPhase = new DeepenTutor();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;
      case "DEEPENTUTEE":
        actPhase = new DeepenTutee();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;
      case "REFLEXION":
        actPhase = new Reflexion();
        this.setState({ phase: actPhase });
        this.props.setPhase(actPhase);
        break;

      default:

        break;
    }


    console.log(this.props.assistent);
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


