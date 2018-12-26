import React, { Component } from "react";

export default class ClientCounter extends Component {
  render() {
    const { roomAvailable, roomData } = this.props.roomState;

    const count =
      roomAvailable && roomData.clients ? roomData.clients.length : 0;

    const popup = `There are ${count} people in ${this.props.roomId}`;

    var content;

    if (this.props.hideIfNull && count === 0) content = null;
    else
      content = (
        <span className={this.props.badgeClass} title={popup}>
          {this.props.pattern.replace("{0}", count)}
        </span>
      );

    return content;
  }
}

ClientCounter.defaultProps = {
  hideIfNull: false,
  pattern: "{0}",
  badgeClass: "badge badge-light"
};
