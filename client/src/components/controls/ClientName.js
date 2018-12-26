import React, { Component } from "react";
import PropTypes from "prop-types";
import RoleIcon from "../../ScriptedCooperation/controlComponents/RoleIcon";

const secondaryColorShade = 0.7;

export default class ClientName extends Component {
  constructor(props) {
    super(props);

    this.colorShadeCache = {};
  }

  render() {
    var nickName;
    var color;

    if (this.props.nickName) {
      nickName = this.props.nickName;
      color = this.props.color ? this.props.color : "#000000";
    } else {
      const clientData = this.props.roomData.state.sharedRoomData.clients[
        this.props.clientId
      ];

      color = clientData.color;
      nickName = clientData.nick;
    }

    return (
      <span
        className="client-name rounded p-1 font-weight-bold"
        style={{
          color: color,
          backgroundColor: this.shadeColor(color)
        }}
      >
        {this.props.allowRoleIcon ? (
          <RoleIcon
            nickName={nickName}
            sharedData={this.props.roomData.state.sharedRoomData}
          />
        ) : null}
        {nickName}
      </span>
    );
  }

  shadeColor(color) {
    if (this.colorShadeCache[color]) return this.colorShadeCache[color];

    const percent = secondaryColorShade;
    var f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;

    const hexShade =
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1);
    this.colorShadeCache[color] = hexShade;
    return hexShade;
  }
}

ClientName.propTypes = {
  roomData: PropTypes.object,
  clientId: PropTypes.string,

  color: PropTypes.string,
  nickName: PropTypes.string,
  showRoleIcon: PropTypes.bool
};

ClientName.defaultProps = {
  showRoleIcon: false
};
