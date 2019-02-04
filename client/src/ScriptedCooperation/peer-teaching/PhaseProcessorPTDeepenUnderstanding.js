import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setSyncState } from "../../actions/localStateActions";
import { SEEK_REQUEST } from "../../components/video-session/PlayBackUiEvents";
import { FEATURES } from "../../reducers/featureTypes";

class PhaseProcessorPTDeepenUnderstanding extends PhaseProcessor {
  constructor(props) {
    super(props);

    this.getTargetTime = this.getTargetTime.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.props.setSyncState(true);

    const isTutor = super.getCurrentRole() === "ROLE_TUTOR";

    this.setEnabledFeatures([FEATURES.SHARED_DOC]);
    if (isTutor) {
      // TODO: shared sync action should define where to jump
      setTimeout(() => {
        window.sessionEvents.dispatch(SEEK_REQUEST, this.getTargetTime());
      }, 1500);
      super.logToChat(
        "Your task is now to support the tutee in summarizing the current section inside the shared document." +
          "Feel free to return to the video and view areas that are unclear"
      );

      super.openGuidePath(
        "/PeerTeachingGuide/DeepenUnderstanding_Tutor.html",
        "simple"
      );
    } else {
      super.logToChat(
        "Your task is now to summarize the contents of the current section presented to you in the shared document. The turor will support you" +
          "Feel free to return to the video and view areas that are unclear"
      );
      super.openGuidePath(
        "/PeerTeachingGuide/DeepenUnderstanding_Tutee.html",
        "simple"
      );
    }
  }

  getTargetTime() {
    const payload = super.getPhasePayload();

    return payload.sectionTime.startTime;
  }
}

export default connect(
  null,
  { setSyncState }
)(PhaseProcessorPTDeepenUnderstanding);
