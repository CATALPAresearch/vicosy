import React, { Component } from "react";
import PropTypes from "prop-types";
import { SessionTypeDefinitionsMapping } from "./SessionTypeDefinitionsMapping";
import { connect } from "react-redux";
import { enableFeatures } from "../actions/restrictionActions";
import {
  setSyncSharedDocInSyncSpace,
  resetSettings
} from "../actions/settingActions";

/**
 * selects phase processor based on current phase
 */
class ClientCooperationProcessor extends Component {
  render() {
    const { sessionData } = this.props;
    // get mapping by session type
    const sessionType = sessionData.meta.sessionType;

    const scriptData = SessionTypeDefinitionsMapping[sessionType];
    const processorMapping = scriptData.processorMapping;

    this.handleGlobalSettings(scriptData);

    // get phase processor by phase id
    const phaseId = sessionData.collabScript.phaseData.phaseId;

    if (!processorMapping[phaseId]) {
      console.error("Processor missing for phase", phaseId);

      return;
    }

    const ProcessorComponent = processorMapping[phaseId];

    // uniqueStepId key is required to make sure that the next component will remount
    // even if it is the same type of component (which may be possible, depending on the script)
    const uniqueKey = sessionData.collabScript.phaseData.uniqueStepId;

    return (
      <ProcessorComponent
        key={uniqueKey}
        sessionData={sessionData}
        auth={this.props.auth}
      />
    );
  }

  handleGlobalSettings(scriptData) {
    if (!scriptData.globalSettings) return;

    const syncSharedEditorInSyncSpace =
      scriptData.globalSettings !== null &&
      scriptData.globalSettings.syncSharedEditorInSyncSpace;
    if (
      this.props.settings.syncSharedDocInSyncSpace !==
      syncSharedEditorInSyncSpace
    ) {
      this.props.setSyncSharedDocInSyncSpace(syncSharedEditorInSyncSpace);
    }
  }

  componentWillUnmount() {
    this.props.enableFeatures();
    this.props.resetSettings();
  }
}

ClientCooperationProcessor.propTypes = {
  sessionData: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  rooms: state.rooms,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { enableFeatures, resetSettings, setSyncSharedDocInSyncSpace }
)(ClientCooperationProcessor);
