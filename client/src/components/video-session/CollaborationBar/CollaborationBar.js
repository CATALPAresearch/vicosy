import React, { Component } from "react";
import "./CollaborationBar.css";
import ClientCooperationProcessor from "../../../ScriptedCooperation/ClientCooperationProcessor";
import { connect } from "react-redux";
import { openPublicGuide } from "../../../actions/localStateActions";
import ProgressBar  from "../Guide/ProgressBar";

class CollaborationBar extends Component {
  onHelpClick = () => {
    this.props.openPublicGuide();
  };

  render() {
    return (
      <div id="CollaborationBar" className="hFlexLayout">
        
        <ProgressBar/>
       {/* <button onClick={this.onHelpClick} className="btn btn-sm btn-info m-1">
          <i className="fa fa-info-circle" /> 
        </button> */}
         
        <ClientCooperationProcessor sessionData={this.props.sharedRoomData} />
        
      </div>
    );
  }
}

export default connect(
  null,
  { openPublicGuide }
)(CollaborationBar);
