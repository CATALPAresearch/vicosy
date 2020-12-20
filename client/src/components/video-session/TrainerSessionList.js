import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect, useStore } from "react-redux";
import { checkRemovedScript, getMyScripts, getScriptById, getMyScriptsBySocket } from "../../actions/scriptActions";
import { SET_SCRIPT_MEMBERS } from "../../actions/types";

export class TrainerSessionList extends Component {
  constructor(props) {
    super(props);
    this.props.getMyScripts(this.props.auth.user.id, this.callback.bind(this));
    var listener = false;

  }
  setScript(scriptId) {
    this.props.getScriptById(scriptId);

  }

  callback() {
    this.props.getMyScriptsBySocket(this.props.auth.user.id, this.props.script.scripts);
    this.props.checkRemovedScript(this.props.auth.user.id, this.props.script.scripts);
  }

 /* startScriptRemoveListener() {
    this.props.checkRemovedScript(this.props.auth.user.id, this.props.script.scripts);
    console.log(this.props.script.scripts);
  }*/
  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var sessionsToRender = null;
    console.log(this.props.roomState);
    if (roomAvailable && "sessions" in roomData.state.sharedRoomData) {
      const { sessions } = roomData.state.sharedRoomData;
      const sessionRoomIds = Object.keys(sessions);

      sessionsToRender = sessionRoomIds.map(sessionId => {
        console.log(sessionId);
        const sessionMeta = sessions[sessionId];
        if (!sessionMeta) return null;
        else
          console.log(sessionMeta);
      }

      )

    };



    //const { roomAvailable, roomData } = this.props.roomState;
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
          console.log(group._id);
          return (
          <tr key={group._id}>
            <th scope="row">{script.scriptName}</th>
            <td className="force-break">{script.videourl}</td>
            <td className="force-break">
              {myGroup.groupMembers.map(member => { return <p key={member._id}>{member.name}</p> })}

            </td>
            <td>{script.scriptType}</td>
            <td>
              <Link
                to={`/session/${group._id}`}
                scriptid={script._id}
                className="btn btn-success"
                onClick={(e) => this.setScript(script._id)}
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
  mapStateToProps, { getMyScripts, getMyScriptsBySocket, getScriptById, checkRemovedScript },
  null
)(TrainerSessionList);
