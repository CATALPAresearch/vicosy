import React, { Component } from "react";
import { connect } from "react-redux";

const connectUIState = ComponentToWrap => {
  const mapStateToProps = state => ({
    localState: state.localState,
    settings: state.settings
  });

  const consumer = class UIStateConsumer extends Component {
    render() {
      const { localState, settings, restrictions } = this.props;

      const isVideoVisible =
        !localState.sharedDocEditing.isOpen && !localState.guide.isOpen;

      const isMarkerUsable = localState.syncState.sync && isVideoVisible;
      const isMarkerActive =
        isMarkerUsable && settings.markerType === "marker-transient";

      return (
        <ComponentToWrap
          {...this.props}
          isVideoVisible={isVideoVisible} // video is visible to user
          isMarkerUsable={isMarkerUsable} // is it usable (video & sync & feature)
          isMarkerActive={isMarkerActive} // usable & setting
        />
      );
    }
  };

  return connect(
    mapStateToProps,
    null
  )(consumer);
};

export default connectUIState;
