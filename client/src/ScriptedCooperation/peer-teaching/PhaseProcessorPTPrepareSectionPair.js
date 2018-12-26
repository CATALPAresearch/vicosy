import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setSyncState } from "../../actions/localStateActions";
import { SEEK_REQUEST } from "../../components/video-session/PlayBackUiEvents";
import { FEATURES } from "../../reducers/featureTypes";

class PhaseProcessorPTPrepareSectionPair extends PhaseProcessor {
  constructor(props) {
    super(props);

    this.getTargetTime = this.getTargetTime.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.props.setSyncState(false);

    // redux actions require a frame to apply changes to the store
    // better: listen to redux state changes and then jump to corresponding time
    setTimeout(() => {
      console.log("jump to target time", this.getTargetTime());

      window.sessionEvents.dispatch(SEEK_REQUEST, this.getTargetTime());
    }, 1500);

    // todo: separate text by role
    super.logToChat(
      "Your task is now to prepare the highlighted section so that you are able to present it to you peer in a following phase." +
        "To do this you can set annotations as anchors and note containers." +
        "You are now working async! You can navigate the video without affecting your peer. If you are done click on ready/continue button"
    );

    this.setEnabledFeatures([FEATURES.ANNOTATING]);
  }

  getTargetTime() {
    const ownRole = super.getCurrentRole();

    const payload = super.getPhasePayload();

    return payload.sectionTimes[ownRole].startTime;
  }

  componentWillUnmount() {}
}

export default connect(
  null,
  { setSyncState }
)(PhaseProcessorPTPrepareSectionPair);
