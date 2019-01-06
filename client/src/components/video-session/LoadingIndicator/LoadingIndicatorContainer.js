import React, { Component } from "react";
import "./loading-indicator.css";
import LoadingIndicator from "./LoadingIndicator";
import connectShared from "../../../highOrderComponents/SharedRoomDataConsumer";
import { connect } from "react-redux";

class LoadingIndicatorContainer extends Component {
  render() {
    const { sharedRoomData } = this.props;
    const { clients } = sharedRoomData;

    const clientIds = Object.keys(clients);

    if (!this.props.localState.syncState.sync) return null;

    const loadingClients = clientIds.filter((clientId, index, array) => {
      const clientData = clients[clientId];
      if (!clientData.readyState || clientData.readyState.playerStalled)
        return true;
      return false;
    });

    const loadingClientsViews = loadingClients.map(clientId => {
      const clientData = clients[clientId];
      return (
        <LoadingIndicator color={clientData.color} key={clientData.nick} />
      );
    });

    return <div id="LoadingIndicatorContainer">{loadingClientsViews}</div>;
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  null
)(connectShared(LoadingIndicatorContainer));
