import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Wrapper - will provide roomstate in props.roomState
class RoomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomAvailable: false,
      roomData: null
    };
  }

  componentDidMount() {
    this.updateRoomState(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateRoomState(newProps);
  }

  updateRoomState(props) {
    const targetRoomId = props.roomId;

    if (targetRoomId in props.rooms.rooms) {
      this.setState({
        roomAvailable: true,
        roomData: props.rooms.rooms[targetRoomId]
      });
    } else {
      this.setState({ roomAvailable: false });
    }
  }

  render() {
    // the variable name must be capitalized
    const Component = this.props.component;
    return this.state.roomAvailable ? (
      <Component
        roomState={this.state}
        roomId={this.props.roomId}
        sharedRoomData={this.state.roomData.state.sharedRoomData}
        {...this.props}
      />
    ) : null;
  }
}

RoomComponent.propTypes = {
  roomId: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  rooms: state.rooms
});

export default connect(mapStateToProps)(RoomComponent);
