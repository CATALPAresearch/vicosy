import React, { Component } from "react";
import { connect } from "react-redux";
import RoomComponent from "../controls/RoomComponent";
import TrainerSessionList from "../video-session/TrainerSessionList";
import ScriptListElement from "./ScriptListElement";
import { getScriptsByUserId, deleteAllScripts, deleteScript, clearScript } from "../../actions/scriptActions"
import { Link } from "react-router-dom";
import "./TrainerLobby.css";
import Logger from "../logic-controls/Logger";


class TrainerLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts: Object,
      scriptToDelete: ""

    }
    this.props.clearScript();

    //this.setListElements.bind(this)
    this.props.getScriptsByUserId(this.props.auth.user.id);
    //to delete all scripts
    // this.props.deleteAllScripts(this.props.auth.user.id);
    //  this.onClick = this.handleCLick.bind(this);

  }
  setListElements(newscripts) {
    console.log(newscripts);
    //if (newscripts==="")
    this.setState({ scripts: newscripts });
  }

  handleCLick(e) {
    const { value } = e.target;
    this.props.history.push("/newtrainerscript/?" + value);
  }

  deleteScript(e) {
    console.log(e);
    this.props.deleteScript(this.state.scriptToDelete);
    this.props.getScriptsByUserId(this.props.auth.user.id);

  }

  passId(e) {
    this.setState({ scriptToDelete: e })
  }

  render() {
    var participants = null;
    //this.setListElements.bind(this)
    // this.props.getScriptsByUserId(this.props.auth.user.id);
    // console.log(this.props.script.scripts);
    if (this.props.script.scripts) {
      participants = this.props.script.scripts.map(script => {
        return <ScriptListElement
          id={script._id}
          key={script._id}
          name={script.scriptName}
          videorul={script.videourl}
          editScript={this.handleCLick.bind(this)}
          deleteScript={this.deleteScript.bind(this)}
          passId={this.passId.bind(this)}
          started={script.started}

        />
      })
    }


    return (

      <div id="trainerlobby" className="container mt-4">
     
          <Logger roomId="trainerlobby" />
          <h1>Trainerlobby</h1>
          {<RoomComponent roomId="trainerlobby" component={TrainerSessionList} />}
          <Link to="/newtrainerscript" className="btn btn-lg primaryCol mr-2">
            Neues Script
        </Link>
          <br></br>
          <div className="list-group">
            {
              participants
            }

          </div>


        <br></br>


        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Achtung!</h5>
                <button type="button" className="Abbrechen" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Script wirklich löschen?
      </div>
              <div className="modal-footer">
                <button type="button" className="btn primaryCol" data-dismiss="modal">Abbrechen</button>
                <button type="button" className="btn primaryCol" onClick={this.deleteScript.bind(this)} data-dismiss="modal">Script löschen</button>
              </div>
            </div>
          </div>
        </div>
        </div>



    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  auth: state.auth,
  script: state.script,
});


export default connect(
  mapStateToProps,
  { getScriptsByUserId, deleteAllScripts, deleteScript, clearScript },
  null
)(TrainerLobby);