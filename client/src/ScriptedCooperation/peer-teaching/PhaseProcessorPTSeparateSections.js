import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { sendScriptProcessorMessage } from "../../socket-handlers/api";
import { FEATURES } from "../../reducers/featureTypes";

export default class PhaseProcessorPTSeparateSections extends PhaseProcessor {
  constructor(props) {
    super(props);

    this.onFetchSectionsClick = this.onFetchSectionsClick.bind(this);
  }

  onFetchSectionsClick() {
    sendScriptProcessorMessage("fetchForeignSections");
  }

  componentDidMount() {
    super.componentDidMount();

    const hasAlreadySections = this.props.sessionData.collabScript.phaseData.getAtPath(
      "payload.foreignSectionsAvailable",
      false
    );
/*
    super.logToChat(
      "The next step is to separate the video into sections by setting section annotations\n" +
        "Only the current tutor is allowed to set these annotations.\n\n" +
        "However, you 2 should discuss together where to set these." +
        "The result of this phase is a sectionlist where you will present the contents of every second section to your peer." +
        "Therefore it is recommended to have an even amount of sections. Otherwise the current tutor will present 1 more section than the other." +
        (hasAlreadySections
          ? "There are already sections available for this video. Tutor can fetch them"
          : "")
    );
    */

    const isTutor = this.getCurrentRole() === "ROLE_TUTOR";

    this.setContent(
      hasAlreadySections && isTutor ? (
        <button
          className="btn btn-info btn-sm"
          onClick={this.onFetchSectionsClick}
        >
          Fetch Sections
        </button>
      ) : null
    );

    if (isTutor) {
      this.setEnabledFeatures([FEATURES.ANNOTATING]);

      super.openGuidePath(
        "/PeerTeachingGuide/SeparateSections_Leader.html",
        "simple"
      );
      super.setPhase("SEPERATESECTIONSTUTOR");
    } else {
      super.openGuidePath(
        "/PeerTeachingGuide/SeparateSections_Joiner.html",
        "simple"
      );
      super.setPhase("SEPERATESECTIONSTUTEE");

    }
  }

  componentWillUnmount() {
    console.log("client section separation ended");
  }
}
