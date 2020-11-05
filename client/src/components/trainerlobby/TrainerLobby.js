import React, { Component } from "react";
import { connect, useStore } from "react-redux";
import RoomComponent from "../controls/RoomComponent";
import TrainerScriptCreator from "../script-options/TrainerScriptCreation/TrainerScriptCreator";
import TrainerSessionList from "../video-session/TrainerSessionList";
import ScriptListElement from "./ScriptListElement";
import { getScriptsByUserId } from "../../actions/scriptActions"
import { Link } from "react-router-dom";
import "./TrainerLobby.css";
import Logger from "../logic-controls/Logger";


class TrainerLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts: Object,
    }
    //this.setListElements.bind(this)
    this.props.getScriptsByUserId(this.props.auth.user.id);

  }
  setListElements(newscripts) {
    console.log(newscripts);
    //if (newscripts==="")
    this.setState({ scripts: newscripts });
  }



  render() {
    var participants = null;
    //this.setListElements.bind(this)
    this.props.getScriptsByUserId(this.props.auth.user.id);
    // console.log(this.props.script.scripts);
    if (this.props.script.scripts) {
      var scriptsArray = Object.keys(this.props.script.scripts);
      participants = this.props.script.scripts.map(script => {

        return <ScriptListElement
          key={script._id}
          name={script.scriptName}
          videorul={script.videourl}

        />
      })
    }


    return (



      <div className="container mt-4">
        <Logger roomId="trainerlobby" />
        <h1>Trainerlobby</h1>
        {<RoomComponent roomId="trainerlobby" component={TrainerSessionList} />}
        <Link to="/newtrainerscript" className="btn btn-lg btn-info mr-2">
          Neue Session
        </Link>

        <div className="list-group">

        </div>



        {
          participants


        }
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
  { getScriptsByUserId },
  null
)(TrainerLobby);