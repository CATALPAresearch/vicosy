import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { checkRemovedScript, getMyScripts, getScriptById, getMyScriptsBySocket } from "../../actions/scriptActions";
import { getScriptByIdCallback } from "../../actions/scriptActions";
import HintArrow from "../Assistent/HintArrow";

export class TrainerSessionList extends Component {
  constructor(props) {
    super(props);
    this.props.getMyScripts(this.props.auth.user.id, this.callback.bind(this));
    this.actualize = this.props.actualize;

  }
  setScript(scriptId, groupId) {
    this.props.getScriptByIdCallback(scriptId, () => {
      this.props.history.push(`/session/${groupId}`);
    });


  }

  callback() {
    this.props.getMyScriptsBySocket(this.props.auth.user.id, this.props.script.scripts, this.actualize);
    this.props.checkRemovedScript(this.props.auth.user.id, this.props.script.scripts, this.actualize);
  
  }

  /* startScriptRemoveListener() {
     this.props.checkRemovedScript(this.props.auth.user.id, this.props.script.scripts);
     console.log(this.props.script.scripts);
   }*/
  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var sessionsToRender = null;
    var scriptsToRender = null;
    var anyScripts = false;

    if (roomAvailable && "sessions" in roomData.state.sharedRoomData) {
      const { sessions } = roomData.state.sharedRoomData;
      const sessionRoomIds = Object.keys(sessions);

      sessionsToRender = sessionRoomIds.map(sessionId => {
        console.log(sessionId);
        const sessionMeta = sessions[sessionId];
        if (!sessionMeta) return null;
        else
          console.log(sessionMeta);
        return null;
      }

      )

    };



    //const { roomAvailable, roomData } = this.props.roomState;

    if (!this.props.script.scripts) {
      scriptsToRender = null;

      return null;
    }
    else
      scriptsToRender = this.props.script.scripts.map(script => {
        anyScripts = true;
        var firstElement = true;
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
            <td className="force-break">
              {myGroup.groupMembers.map(member => { return <p key={member._id}>{member.name}</p> })}

            </td>
            {/* <td>{script.scriptType}</td> */}
            <td>

              {firstElement ?
                <button
                  onClick={(e) => this.setScript(script._id, group._id)}
                  scriptid={script._id}
                  className="btn primaryCol"
                  id="join-session"

                >
                  join
                <span className="badge ml-2 badge-light">
                    {script.clientCount}
                  </span>
                </button>
                : <button
                  onClick={(e) => this.setScript(script._id, group._id)}
                  scriptid={script._id}
                  className="btn btn-success"

                >
                  join
              <span className="badge ml-2 badge-light">
                    {script.clientCount}
                  </span>
                </button>
              }
            </td>
            {firstElement = false}
          </tr>
        );

      });

    return (
      <div>
        {anyScripts ? <table className="table table-striped">
          <thead>
            <tr>
              <th id="session-list" scope="col">Session</th>
              <th scope="col">Members</th>
              <th scope="col">
                {this.props.assistent.actInstruction ? this.props.assistent.active && this.props.assistent.actInstruction.markers === "join-session" ?
                  <HintArrow
                    style={{ position: "absolute" }}
                    direction="down"
                  /> : null : null}

                Join</th>
            </tr>
          </thead>
          <tbody>{scriptsToRender}</tbody>
        </table> : <h4>Es stehen keine Sessions zur Verfügung!</h4>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  script: state.script,
  assistent: state.assistent
});

export default connect(
  mapStateToProps, { getScriptByIdCallback, getMyScripts, getMyScriptsBySocket, getScriptById, checkRemovedScript },
  null
)(withRouter(TrainerSessionList));
