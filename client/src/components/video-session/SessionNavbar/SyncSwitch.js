import { connect } from "react-redux";
import React, { Component } from "react";
import ToggleSwitch from "../../controls/Switch/ToggleSwitch";
import classnames from "classnames";
import { setSyncState } from "../../../actions/localStateActions";
import { LOG } from "../../logic-controls/logEvents";
import ToggleSwitchButton from "../../controls/ToggleSwitchButton";
import { FEATURES } from "../../../reducers/featureTypes";
import connectShared from "../../../highOrderComponents/SharedRoomDataConsumer";
import "./SessionNavbar.css";
import HintArrow from "../../Assistent/HintArrow";

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
          "Du bist jetzt im 'Sync Video Mode'. Handlungen wie Navigation und malen wirken sich auf alle aus."
      });
    } else {
      window.logEvents.dispatch(LOG, {
        class: "danger",
        message:
          "Du bist im 'Async Video Mode'. Navigation im Video wirkt sich nur bei dir aus."
      });
    }
  }

  render() {
    const synched = this.props.localState.syncState.sync;
    const isDisabled = !!this.props.restrictions.disabledFeatures[
      FEATURES.SYNC_SWITCH
    ];

    const clientsObj = this.props.sharedRoomData.clients;
    const clientIds = Object.keys(clientsObj);

    var syncClientCount = 0;
    for (let i = 0; i < clientIds.length; i++) {
      const clientId = clientIds[i];
      if (clientId === this.props.ownSocketId) continue;

      if (clientsObj[clientId].getAtPath(`remoteState.syncState.sync`, true))
        ++syncClientCount;
    }

    const syncBadge = (
      <span id="sync-mode"
        className={classnames("sync-counter badge", {
          "badge-secondary": syncClientCount === 0,
          "badge-success": syncClientCount > 0,
          sync: synched,
          async: !synched,
          "alpha-pulse": !synched && syncClientCount > 0
        })}
        title={`Clients in synchronous mode`}
      >
        {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.actInstruction.markers === "sync-mode" ?
          <HintArrow
            style={{ position: "absolute", marginTop: 25, marginLeft: -80, zIndex: 1000 }}
            direction="up"
          /> : null:null}

        {syncClientCount}
      </span>
    );

    const targetLabel = synched
      ? syncClientCount > 0
        ? "synched"
        : "ready to sync"
      : "unsynched";

    const targetButtonTooltip = synched
      ? "Synchroner Modus"
      : "Asynchroner Modus";

    const extraContent = synched ? syncBadge : null;
    onToggle();
    onToggle();
    return (
      <div id="synchswitch" className="hFlexLayout ml-1 mr-1">
        {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.actInstruction.markers === "synchswitch" ?
          <HintArrow
            style={{ position: "absolute", marginTop: 90, marginLeft: 60, zIndex: 1000 }}
            direction="up"
          /> : null:null}
        <button
          disabled={isDisabled}
          onClick={this.onToggle}
          className={classnames("btn btn-sm hFlexLayout", {
            "btn-success": synched,
            "sync-switch-ready-noone": synched && syncClientCount === 0,
            "btn-danger": !synched
          })}
          title={targetButtonTooltip}
        >
          <span className="mr-1">{targetLabel}</span>{" "}
          <ToggleSwitch checked={synched} readonly={true} />
          {extraContent}
        </button>
        {synched ? null : <span onClick={this.onToggle}>{syncBadge}</span>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  restrictions: state.restrictions,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { setSyncState }
)(connectShared(SyncSwitch));
