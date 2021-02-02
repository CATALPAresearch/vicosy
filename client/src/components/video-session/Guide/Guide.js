import React, { Component } from "react";
import "./guide.css";
import { connect } from "react-redux";
import { closePublicGuide } from "../../../actions/localStateActions";
// import { setPhase, setActInstruction } from "../../../actions/assistentActions";
import HTMLLoader from "../../html-loader/HTMLLoader";
import ReadyContinueScriptButton from "../../../ScriptedCooperation/controlComponents/ReadyContinueScriptButton";
import AssistentController from "../../Assistent/AssistentController";
import ProgressBar from "./ProgressBar";
import RoomComponent from "../../controls/RoomComponent";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.assistentControlRef = null;
  }


  onConfirmed = () => {
    //console.log(this.props.assistent.phase.name);
    this.props.closePublicGuide();
    switch (this.props.assistent.phase.name) {
      case "SEPARATESECTIONSTUTORPRE":
        this.setPhase("SEPARATESECTIONSTUTORPOST");
        break;
      case "SEPARATESECTIONSTUTEEPRE":
        this.setPhase("SEPARATESECTIONSTUTEEPOST");
        break;
      case "PREPAREPRE":
        this.setPhase("PREPAREPOST");
        break;
      case "PRESENTTUTEEPRE":
        this.setPhase("PRESENTTUTEEPOST");
        break;
      case "PRESENTTUTORPRE":
        this.setPhase("PRESENTTUTORPOST");
        break;
      case "DEEPENTUTEEPRE":
        this.setPhase("DEEPENTUTEEPOST");
        break;
      case "DEEPENTUTORPRE":
        this.setPhase("DEEPENTUTORPOST");
        break;
      case "REFLECTIONPRE":
        this.setPhase("REFLECTIONPOST");
        break;



    }
  };
  setPhase(phase) {
    this.assistentControlRef.setPhase(phase);
  }


  render() {
    console.log(this.props);
    const { isOpen, activeUrl, confirmationMode } = this.props.localState.guide;
    if (!isOpen || activeUrl === "") return null;

    var confirmationComponent = null;

    switch (confirmationMode) {
      case "simple":
        confirmationComponent = (
          <button id="ok-understand"
            onClick={this.onConfirmed}
            className="btn btn-small btn-success"
          >
            Ok, I understand
          </button>
        );
        break;
      case "scriptready":
        confirmationComponent = (
          <ReadyContinueScriptButton sessionId={this.props.roomId} />
        );
        break;
      case "none":
        confirmationComponent = "Waiting for condition to continue...";
        break;

      default:
        break;
    }

    const targetUrl = window.location.href.replace(window.location.pathname, "") + activeUrl; // e.g. /PeerTeachingGuide/Intro.html
    console.log(
      "html target url",
      targetUrl,
      process.env.PUBLIC_URL,
      activeUrl
    );

    return (
      <div id="Guide">
        <div id="GuideFooter" className="guide-flex-item">
          {/*
        <RoomComponent
            roomId="ProgressBar"
            component={ProgressBar}
          />
*/}

          <ProgressBar />
          <div className="w-20 p-3">
            {confirmationComponent}
          </div>
        </div>

        <div id="InnerGuide" className="roundedStrong">

          <HTMLLoader url={targetUrl} />
          <AssistentController createRef={el => (this.assistentControlRef = el)} />

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { closePublicGuide }
)(Guide);
