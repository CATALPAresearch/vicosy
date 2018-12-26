import React, { Component } from "react";
import "./slider.css";
import connectShared from "../../../highOrderComponents/SharedRoomDataConsumer";
import ClientName from "../../controls/ClientName";
import { getRemoteScrubClient } from "../../../helpers/rooms/roomsHelper";

// displays a "ghost" represenation of where a peer scrubs
class RemoteScrubLine extends Component {
  render() {
    var scrubberClient = getRemoteScrubClient(this.props.sharedRoomData);

    if (!scrubberClient) return null;

    var remoteScrubPerc = scrubberClient.remoteState.scrubState.perc;

    remoteScrubPerc = remoteScrubPerc * 100 + "%";

    return (
      <div className="timeline-overlay remote-scrub-line">
        <div
          className="remote-handle"
          style={{
            left: remoteScrubPerc
          }}
        >
          <div className="remote-handle-label">
            <ClientName
              nickName={scrubberClient.nick}
              color={scrubberClient.color}
            />
          </div>
          <i className="group-timeline-handle-image fa fa-users" />
          <i
            className="fa fa-hands remote-handle-icon"
            style={{ color: scrubberClient.color }}
          />
        </div>
      </div>
    );
  }
}

export default connectShared(RemoteScrubLine);
