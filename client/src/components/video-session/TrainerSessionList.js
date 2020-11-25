import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect, useStore } from "react-redux";
import { getMyScripts } from "../../actions/scriptActions";

export class TrainerSessionList extends Component {
  constructor(props) {
    super(props);
    this.props.getMyScripts(this.props.auth.user.id);

  }

  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var scriptsToRender = null;
    if (!this.props.script.scripts) return null;
    else
      scriptsToRender = this.props.script.scripts.map(script => {
        var myGroup = null;
        for (var group of script.groups)

          if (group.groupMembers.some(member => member._id === this.props.auth.user.id)) {
            myGroup = group;
          } else {
            alert("Group not found");
          }
        return (
          <tr key={group._id}>
            <th scope="row">{script.scriptName}</th>
            <td className="force-break">{script.videourl}</td>
            <td className="force-break">
            {myGroup.groupMembers.map(member=>  {return <p>{member.name}</p>})}
            
            </td>
            <td>{script.scriptType}</td>
            <td>
              <Link
                to={`/session/${group._id}`}
                className="btn btn-success"
              >
                join
          <span className="badge ml-2 badge-light">
                  {script.clientCount}
                </span>
              </Link>
            </td>
          </tr>
        );

      });

    /*
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
            <td className="force-break">{sessionMeta.videoUrl}</td>
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
*/
    return (
      <div>
        <h1>Session List</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Session</th>
              <th scope="col">Video-Url</th>
              <th scope="col">Teilnehmer</th>
              <th scope="col">Collaboration</th>
              <th scope="col">Join</th>
            </tr>
          </thead>
          <tbody>{scriptsToRender}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  script: state.script,
});

export default connect(
  mapStateToProps, { getMyScripts },
  null
)(TrainerSessionList);
