import React, { Component } from "react";
import PropTypes from "prop-types";

export default class RoomContextDataProvider extends Component {
  static propTypes = {
    roomId: PropTypes.string.isRequired
  };
  // you must specify what you’re adding to the context
  static childContextTypes = {
    roomId: PropTypes.string.isRequired
  };

  getChildContext() {
    const { roomId } = this.props;
    return { roomId };
  }

  render() {
    return this.props.children;
  }
}
