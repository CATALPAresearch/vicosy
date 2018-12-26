import PhaseProcessor from "../PhaseProcessor";
import React, { Component } from "react";

export default class PhaseProcessorPTWarmUp extends PhaseProcessor {
  componentDidMount() {
    super.componentDidMount();

    console.log("client phase warm up started");
    super.logToChat(
      "Welcome to the peer teaching collaboration script.\nWith this script you both will build up knowledge about the given video together.\n" +
        "The script will lead you through phases where you will be in the role of a teacher or student.\n\n" +
        "To achieve this it is recommended to communicate in a rich way. You currently can communicate via the chat, but consider to upgrade to video or audio conference." +
        "introduce yourself to your peer and click ready if you want to start the script!"
    );

    this.setContent(null);
  }

  componentWillUnmount() {
    console.log("client phase warm up ended");
  }
}
