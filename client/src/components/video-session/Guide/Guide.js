import React, { Component } from "react";
import "./guide.css";
import { connect } from "react-redux";
import { closePublicGuide } from "../../../actions/localStateActions";

import HTMLLoader from "../../html-loader/HTMLLoader";
import ReadyContinueScriptButton from "../../../ScriptedCooperation/controlComponents/ReadyContinueScriptButton";

class Guide extends Component {
  onConfirmed = () => {
    this.props.closePublicGuide();
  };

  render() {
    const { isOpen, activeUrl, confirmationMode } = this.props.localState.guide;
    if (!isOpen || activeUrl === "") return null;

    var confirmationComponent = null;

    switch (confirmationMode) {
      case "simple":
        confirmationComponent = (
          <button
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

    const targetUrl = "https://closeuptogether.neocities.org" + activeUrl; // e.g. /PeerTeachingGuide/Intro.html
    console.log(
      "html target url",
      targetUrl,
      process.env.PUBLIC_URL,
      activeUrl
    );

    return (
      <div id="Guide">
        <div id="InnerGuide" className="roundedStrong">
          <div id="GuideHeader" className="guide-flex-item">
            Guide <i className="ml-1 fa fa-info-circle" />
          </div>
          <div className="guide-flex-item-grow" id="IframeContent">
            <HTMLLoader url={targetUrl} />
          </div>
          <div id="GuideFooter" className="guide-flex-item">
            {confirmationComponent}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { closePublicGuide }
)(Guide);
