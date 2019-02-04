import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ownSocketId } from "../socket-handlers/api";

const connectUserData = ComponentToWrap => {
  const mapStateToProps = state => ({
    rooms: state.rooms,
    auth: state.auth
  });

  const consumer = class OwnUserDataConsumer extends Component {
    // let’s define what’s needed from the `context`
    static contextTypes = {
      roomId: PropTypes.string.isRequired
    };

    render() {
      const { roomId } = this.context;
      const sharedRoomData = this.props.rooms.rooms[roomId].state
        .sharedRoomData;

      const clientData = sharedRoomData.clients[ownSocketId()];

      if (!clientData) return null;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `sharedRoomData` prop, like a hook
      return (
        <ComponentToWrap
          {...this.props}
          roomId={roomId}
          ownAuthNick={this.props.auth.user.name}
          ownSocketId={ownSocketId()}
          ownNick={clientData.nick}
          ownColor={clientData.color}
        />
      );
    }
  };

  return connect(
    mapStateToProps,
    null
  )(consumer);
};

export default connectUserData;
