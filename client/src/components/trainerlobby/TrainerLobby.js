import React, { Component } from "react";
import { connect, useStore } from "react-redux";
import RoomComponent from "../controls/RoomComponent";
import TrainerScriptCreator from "../script-options/TrainerScriptCreation/TrainerScriptCreator";
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
    const { id, value } = e.target;
    this.props.history.push("/newtrainerscript/?" + value);
  }

  deleteScript(e) {
    const { id, value } = e.target;
    this.props.deleteScript(value);
    this.props.getScriptsByUserId(this.props.auth.user.id);

  }


  render() {

    var participants = null;
    //this.setListElements.bind(this)
    // this.props.getScriptsByUserId(this.props.auth.user.id);
    // console.log(this.props.script.scripts);
    if (this.props.script.scripts) {
      var scriptsArray = Object.keys(this.props.script.scripts);
      participants = this.props.script.scripts.map(script => {
        console.log(script.expLevel);
        return <ScriptListElement
          id={script._id}
          key={script._id}
          name={script.scriptName}
          videorul={script.videourl}
          editScript={this.handleCLick.bind(this)}
          deleteScript={this.deleteScript.bind(this)}

        />
      })
    }


    return (



      <div className="container mt-4">
        <Logger roomId="trainerlobby" />
        <h1>Trainerlobby</h1>
        {<RoomComponent roomId="trainerlobby" component={TrainerSessionList} />}
        <Link to="/newtrainerscript" className="btn btn-lg btn-info mr-2">
          Neues Script
        </Link>
        <br></br>
        <div className="list-group">
          {
            participants
          }

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