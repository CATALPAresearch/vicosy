import { connect } from "react-redux";
import React, { Component } from "react";
import ToggleSwitch from "../../controls/Switch/ToggleSwitch";
import classnames from "classnames";
import { setSyncState } from "../../../actions/localStateActions";
import { LOG } from "../../logic-controls/logEvents";
import ToggleSwitchButton from "../../controls/ToggleSwitchButton";
import { FEATURES } from "../../../reducers/featureTypes";

class SyncSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sync: true
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(evt) {
    const nextSyncState = !this.props.localState.syncState.sync;
    this.props.setSyncState(nextSyncState);

    if (nextSyncState) {
      window.logEvents.dispatch(LOG, {
        class: "success",
        message:
          "You are now in the 'sync space'. Transient actions like navigating the video or drawing will now affect others in the 'sync space'"
      });
    } else {
      window.logEvents.dispatch(LOG, {
        class: "danger",
        message:
          "You left the 'sync space'. Transient actions like navigating the video or drawing will not be shared with others. Persistent actions like editing annotations or the shared doc are still visible for others."
      });
    }
  }

  render() {
    const synched = this.props.localState.syncState.sync;
    const isDisabled = !!this.props.restrictions.disabledFeatures[
      FEATURES.SYNC_SWITCH
    ];

    return (
      <div className="mr-1">
        <ToggleSwitchButton
          isDisabled={isDisabled}
          isChecked={synched}
          label={"Sync Video"}
          onToggle={this.onToggle}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  restrictions: state.restrictions
});

export default connect(
  mapStateToProps,
  { setSyncState }
)(SyncSwitch);
