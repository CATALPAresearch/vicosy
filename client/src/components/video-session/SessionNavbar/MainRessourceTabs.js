import React, { Component } from "react";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import { connect } from "react-redux";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";

class MainRessourceTabs extends Component {
  constructor(props) {
    super(props);
    this.sessionId = this.props.sessionId;

    this.state = {
      tabs: []
    };
  }
  /*
    componentDidUpdate () {
     if( this.props.rooms.rooms[this.sessionId].state.sharedRoomData.collabScript.phaseData.phaseId==="PHASE_SEPARATE_SECTIONS");
  
    }
    */
  toggleSharedDoc = () => {
    window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  };

  componentDidMount() {
    const tabs = [
      {
        id: "video-tab",
        callback: this.toggleSharedDoc,
        name: "Video"
      },
      {
        id: "doc-tab",
        callback: this.toggleSharedDoc,
        name: "Shared Document"
      }
    ];

    this.setState({ tabs });
  }

  render() {

    const selectedTabId = this.props.localState.sharedDocEditing.isOpen
      ? "doc-tab"
      : "video-tab";

    const tabsEntries = this.state.tabs.map(tab => {
      const isSelected = selectedTabId === tab.id;
     // const isDisabled = tab.id == "doc-tab" && this.props.rooms.rooms[this.sessionId].state.sharedRoomData.collabScript.phaseData.phaseId === "PHASE_SEPARATE_SECTIONS";

     // if(!isDisabled)
      return (
        // (this.props.rooms.rooms[this.sessionId].state.sharedRoomData.collabScript.phaseData.phaseId!=="PHASE_SEPARATE_SECTIONS"||tab.id!=="doc-tab")?
        
        <li key={tab.id} className="nav-item">
          
            <a
              className={`nav-link${isSelected ? " active prevent-pointer" : ""}`}
              id={tab.id}
              data-toggle="tab"
              href="#"
              role="tab"
              aria-controls={tab.id}
              aria-selected={isSelected ? "true" : "false"}
              onClick={tab.callback}

            >
              {tab.name} {!!tab.extraContent ? tab.extraContent : null}
            </a> 
        </li>
      );
    });

    return (
      <div>
        <ul
          className="nav nav-tabs nav-justified"
          id="MainRessourceTab"
          role="tablist"
        >
          {tabsEntries}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  {
    setSharedDocEditing
  }
)(MainRessourceTabs);
