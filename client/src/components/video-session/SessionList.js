import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SessionList extends Component {
  render() {
    const { roomAvailable, roomData } = this.props.roomState;

    var sessionsToRender = null;
    if (roomAvailable && "sessions" in roomData.state.sharedRoomData) {
      const { sessions } = roomData.state.sharedRoomData;
      const sessionRoomIds = Object.keys(sessions);

      sessionsToRender = sessionRoomIds.map(sessionId => {
        const sessionMeta = sessions[sessionId];
        if (!sessionMeta) return null;

        return (
          <tr key={sessionMeta.roomId}>
            <th scope="row">{sessionMeta.roomName}</th>
            <td>{sessionMeta.videoUrl}</td>
            <td>{sessionMeta.sessionType}</td>
            <td>
              <Link
                to={`/session/${sessionMeta.roomId}`}
                className="btn btn-success"
              >
                join
                <span className="badge ml-2 badge-light">
                  {sessionMeta.clientCount}
                </span>
              </Link>
            </td>
          </tr>
        );
      });
    }

    return (
      <div>
        <h1>Session List</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Session</th>
              <th scope="col">Video-Url</th>
              <th scope="col">Collaboration</th>
              <th scope="col">Join</th>
            </tr>
          </thead>
          <tbody>{sessionsToRender}</tbody>
        </table>
      </div>
    );
  }
}
