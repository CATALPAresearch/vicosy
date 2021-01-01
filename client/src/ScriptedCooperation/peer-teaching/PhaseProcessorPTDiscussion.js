import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setSyncState } from "../../actions/localStateActions";
import { SEEK_REQUEST } from "../../components/video-session/PlayBackUiEvents";
import { FEATURES } from "../../reducers/featureTypes";

class PhaseProcessorPTDiscussion extends PhaseProcessor {
  constructor(props) {
    super(props);

    this.getTargetTime = this.getTargetTime.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.props.setSyncState(true);

    this.setEnabledFeatures([FEATURES.SHARED_DOC]);
    super.setPhase("DISCUSSION");
    super.openGuidePath("/PeerTeachingGuide/Discussion.html", "simple");

    setTimeout(() => {
      window.sessionEvents.dispatch(SEEK_REQUEST, this.getTargetTime());
    }, 1500);
  }

  getTargetTime() {
    const payload = super.getPhasePayload();

    return payload.sectionTime.startTime;
  }
}

export default connect(
  null,
  { setSyncState }
)(PhaseProcessorPTDiscussion);
