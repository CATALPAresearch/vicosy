import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";
import { FEATURES } from "../../reducers/featureTypes";

export default class PhaseProcessorPTGetTogether extends PhaseProcessor {
  componentDidMount() {
    super.componentDidMount();

    console.log("client phase get together started");
   /*
    super.logToChat(
      `Waiting for peer. You can invite your peer by sending him this URL: ${
        window.location.href
      }`
    );
    */

    super.openGuidePath("/PeerTeachingGuide/GetTogether.html", "none");
    super.setPhase("GETTOGETHER");

  }

  componentWillUnmount() {
    console.log("client phase get together ended");
  }
}
