import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FEATURES } from "../../reducers/featureTypes";

class PhaseProcessorPTCompletion extends PhaseProcessor {
  componentDidMount() {
    super.componentDidMount();

    this.setEnabledFeatures([]);

    super.openGuidePath("/PeerTeachingGuide/Completion.html", "none");
  }
}

export default connect(
  null,
  null
)(PhaseProcessorPTCompletion);
