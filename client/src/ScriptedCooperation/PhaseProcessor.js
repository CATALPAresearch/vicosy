import React, { Component } from "react";
import { LOG } from "../components/logic-controls/logEvents";
import "./ScriptedCollaboration.css";
import PropTypes from "prop-types";
import ReadyContinueScriptButton from "./controlComponents/ReadyContinueScriptButton";
import FeatureSetup, {
  MODE_DISABLE_ALL_BUT,
  MODE_ENABLE_ALL_BUT
} from "./controlComponents/FeatureSetup";
import SectionHighlighting from "./controlComponents/SectionHighlighting";
import GuideController from "./controlComponents/GuideController";
import PhaseController from "../components/Assistent/PhaseController";
import EvalLogger from "../components/video-session/Evaluation/EvalLogger";
import { NEXT_PHASE } from "../components/video-session/Evaluation/EvalLogEvents";


// base class for phase processors
export default class PhaseProcessor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specificContent: null,
      featureSetupMode: MODE_DISABLE_ALL_BUT,
      features: []
    };

    this.guideControlRef = null;
    this.assistentControlRef = null;
    this.evalLoggerRef = null;

  }

  /**
   * Protected
   */

  componentDidMount() { }

  logToChat(message) {
    setTimeout(() => {
      message = `${this.props.sessionData.collabScript.phaseData.phaseId
        }: ${message}`;

      window.logEvents.dispatch(LOG, {
        class: "warning", // TODO: introduce own style
        message
      });
    }, 800);
  }

  // modes: simple, scriptready, none
  openGuidePath(publicUrl, confirmationMode = "simple") {
    this.guideControlRef.openGuide(publicUrl, confirmationMode);
  }

  closeGuide() {
    this.guideControlRef.closeGuide();
  };

  setPhase(phase) {

    this.assistentControlRef.setPhase(phase);
    setTimeout(()=> {
      this.evalLoggerRef.logToEvaluation(this.constructor.name, NEXT_PHASE, phase);
      ;
    }, 1000);

  }

  setContent(rectNode) {
    this.setState({ specificContent: rectNode });
  }

  // this will disable all others
  setEnabledFeatures(features) {
    this.setState({ featureSetupMode: MODE_DISABLE_ALL_BUT, features });
  }

  // this will enable all others
  setDisabledFeatures(features) {
    this.setState({ featureSetupMode: MODE_ENABLE_ALL_BUT, features });
  }

  getCurrentRole() {
    return this.props.sessionData.collabScript.getAtPath(
      `roles.${this.props.auth.user.name}`,
      "none"
    );
  }

  getPhasePayload() {
    return this.props.sessionData.collabScript.phaseData.payload;
  }

  /**
   * private
   */

  render() {
    const { sessionData } = this.props;
    /*
        const sessionType = sessionData.meta.sessionType;
        const phase = sessionData.collabScript.phaseData.phaseId;
    */
    const currentRole = this.getCurrentRole();

    return (
      <div id="PhaseBarContent">
        <EvalLogger createRef={el => (this.evalLoggerRef = el)} />

        {/*
        <div>
          {sessionType} > {phase} > {currentRole}
        </div> */}
        <div className="hFlexLayout">


          {this.state.specificContent}
          <ReadyContinueScriptButton sessionData={sessionData} />

          <FeatureSetup
            mode={this.state.featureSetupMode}
            features={this.state.features}
          />
          <SectionHighlighting
            sessionData={sessionData}
            ownRole={currentRole}
          />
          <GuideController createRef={el => (this.guideControlRef = el)} />
          <PhaseController createRef={el => (this.assistentControlRef = el)} />
        </div>
      </div>
    );
  }
}

PhaseProcessor.propTypes = {
  sessionData: PropTypes.object.isRequired
};
