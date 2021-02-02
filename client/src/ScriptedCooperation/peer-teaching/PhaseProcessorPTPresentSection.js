import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setSyncState } from "../../actions/localStateActions";
import { SEEK_REQUEST } from "../../components/video-session/PlayBackUiEvents";
import { FEATURES } from "../../reducers/featureTypes";
import { supported } from "plyr";

class PhaseProcessorPTPresentSection extends PhaseProcessor {
  constructor(props) {
    super(props);

    this.getTargetTime = this.getTargetTime.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.props.setSyncState(true);

    const isTutor = super.getCurrentRole() === "ROLE_TUTOR";

    if (isTutor) {
      // TODO: shared sync action should define where to jump
      setTimeout(() => {
        console.log("jump to target time", this.getTargetTime());

        window.sessionEvents.dispatch(SEEK_REQUEST, this.getTargetTime());
      }, 1500);
      this.setEnabledFeatures([FEATURES.MARKERS]);
     /*
      super.logToChat(
        "Your task is now to present the highlighted section." +
          "You can now jump from annotation to annotation, highlight specific areas in the video and act like a teacher!" +
          "be open for your peers questions since he will summarize the contents you explain in the next phase inside a shared document."
      );
      */
      super.setPhase("PRESENTTUTOR");
      super.openGuidePath(
        "/PeerTeachingGuide/PresentSection_Tutor.html",
        "simple"
      );
    } else {
      /*
      super.logToChat(
        "Your peer will now present the contents of the highlighted section to you." +
          "Listen intense and ask if things are unclear to you, since you have to summarize the contents in a shared document in the following phase"
      );*/
      super.setPhase("PRESENTTUTEE");
      super.openGuidePath(
        "/PeerTeachingGuide/PresentSection_Tutee.html",
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
)(PhaseProcessorPTPresentSection);
