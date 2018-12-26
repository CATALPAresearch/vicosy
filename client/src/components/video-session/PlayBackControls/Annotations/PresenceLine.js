import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PresenceCue from "./PresenceCue";
import { ownSocketId } from "../../../../socket-handlers/api";
import "./cues.css";

class PresenceLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cues: []
    };
  }

  componentWillReceiveProps(nextProps) {
    var targetCues = [];

    const syncClientNicks = [];
    // extract async clients
    try {
      const clients = Object.values(
        nextProps.rooms.rooms[this.props.roomId].state.sharedRoomData.clients
      );

      // filter async clients
      const asyncClients = clients.filter(client => {
        if (client.getAtPath("remoteState.syncState.sync", true)) {
          if (ownSocketId() !== client.id) syncClientNicks.push(client.nick);

          return false;
        }

        return true;
      });

      if (asyncClients) {
        // extract required cue data
        const asyncCueDatas = asyncClients.map(client => {
          return {
            id: client.id,
            nick: client.nick,
            color: client.color,
            timestamp: client.remoteState.syncState.asyncTimestamp
          };
        });

        if (asyncCueDatas) targetCues = asyncCueDatas;
        else targetCues = [];
      } else {
        targetCues = [];
      }
    } catch (e) {
      targetCues = [];
    }

    // check for group presence
    // const annotationToEdit = nextProps.localState.annotationEditing;
    try {
      if (!this.props.localState.syncState.sync && syncClientNicks.length > 0) {
        const syncTime =
          nextProps.rooms.rooms[this.props.roomId].state.sharedRoomData
            .syncAction.time;

        targetCues.push({
          id: "group",
          isGroup: true,
          nick: `Group in sync space: ${syncClientNicks.join(", ")}`,
          timestamp: syncTime
        });
      }
    } catch (e) {}

    this.setState({ cues: targetCues });
  }

  getValidContent() {
    const cues = this.state.cues.map(cuePoint => {
      const cuePointRaw = cuePoint;
      cuePoint = parseFloat(cuePoint.timestamp);
      if (cuePoint > this.props.videoDuration)
        cuePoint = this.props.videoDuration;

      var percent = (cuePoint / this.props.videoDuration) * 100;

      if (percent > 100) percent = 100;

      return (
        <PresenceCue
          key={cuePointRaw.id}
          positionAbs={cuePoint}
          positionRel={percent + "%"}
          meta={cuePointRaw}
        />
      );
    });

    return <div className="timeline-overlay presence-line">{cues}</div>;
  }

  render() {
    return this.props.videoDuration > 0 ? this.getValidContent() : null;
  }
}

PresenceLine.propTypes = {
  videoDuration: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  rooms: state.rooms,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  null
)(PresenceLine);
