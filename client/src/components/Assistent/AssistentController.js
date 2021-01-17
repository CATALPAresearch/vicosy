import React, { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { setIncominginstruction, setPhase, setActInstruction } from "../../actions/assistentActions";
import { connect } from "react-redux";
import { ReflectionPre, ReflectionPost, PresentTutorPost, PresentTuteePost, PresentTutorPre, PresentTuteePre, PreparePost, PreparePre, GetTogether, WarmUp, SeparateSectionsTuteePost, SeparateSectionsTutorPost, DeepenTutorPre, DeepenTuteePre, DeepenTutorPost, DeepenTuteePost, Reflexion, SeparateSectionsTutorPrep, SeparateSectionsTuteePrep } from "./phases/Phases";


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
    console.log(this.props.script);
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
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "WARMUP":
        actPhase = new WarmUp(this.props.script.phase0Assignment);
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "SEPERATESECTIONSTUTOR":
        actPhase = new SeparateSectionsTutorPrep();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "SEPERATESECTIONSTUTEE":
        actPhase = new SeparateSectionsTuteePrep();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "SEPARATESECTIONSTUTORPOST":
        actPhase = new SeparateSectionsTutorPost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "SEPARATESECTIONSTUTEEPOST":
        actPhase = new SeparateSectionsTuteePost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PREPARE":
        actPhase = new PreparePre();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PREPAREPOST":
        actPhase = new PreparePost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PRESENTTUTOR":
        actPhase = new PresentTutorPre();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PRESENTTUTEE":
        actPhase = new PresentTuteePre();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PRESENTTUTORPOST":
        actPhase = new PresentTutorPost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "PRESENTTUTEEPOST":
        actPhase = new PresentTuteePost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "DEEPENTUTOR":
        actPhase = new DeepenTutorPre();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "DEEPENTUTORPOST":
        actPhase = new DeepenTutorPost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "DEEPENTUTEE":
        actPhase = new DeepenTuteePre();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "DEEPENTUTEEPOST":
        actPhase = new DeepenTuteePost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "REFLECTION":
        actPhase = new ReflectionPre(this.props.script.phase5Assignment);
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
        this.props.setPhase(actPhase);
        break;
      case "REFLECTIONPOST":
        actPhase = new ReflectionPost();
        this.setState({ phase: actPhase });
        this.props.setIncominginstruction(null);
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
  assistent: state.assistent,
  script: state.script
});


export default connect(
  mapStateToProps,
  { openPublicGuide, closePublicGuide, setPhase, setActInstruction, setIncominginstruction }
)(AssistentController);


