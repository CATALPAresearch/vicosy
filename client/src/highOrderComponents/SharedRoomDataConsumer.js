import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ownSocketId } from "../socket-handlers/api";

const connectShared = ComponentToWrap => {
  const mapStateToProps = state => ({
    rooms: state.rooms
  });

  const consumer = class SharedRoomDataConsumer extends Component {
    // let’s define what’s needed from the `context`
    static contextTypes = {
      roomId: PropTypes.string.isRequired
    };

    render() {
      const { roomId, ownNick, ownColor } = this.context;
      const sharedRoomData = this.props.rooms.rooms[roomId].state
        .sharedRoomData;

      // what we do is basically rendering `ComponentToWrap`
      // with an added `sharedRoomData` prop, like a hook
      return (
        <ComponentToWrap
          {...this.props}
          sharedRoomData={sharedRoomData}
          roomId={roomId}
          ownSocketId={ownSocketId()}
          ownNick={ownNick}
          ownColor={ownColor}
        />
      );
    }
  };

  return connect(
    mapStateToProps,
    null
  )(consumer);
};

export default connectShared;
