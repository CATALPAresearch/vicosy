import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectSidebarTabActivities,
  selectSidebarTabNotes,
  selectSidebarTabAnnotations
} from "../../../actions/localStateActions";
// import ActivityCounter from "../../chat/ActivityCounter";
import "./sidebar-tabs.css";
import Interactive from "../../controls/Interactive";
import HintArrow from "../../Assistent/HintArrow";
import EvalLogger from "../../video-session/Evaluation/EvalLogger";
import { CHAT_TAB, ANNOT_TAB, NOTES_TAB } from "../../video-session/Evaluation/EvalLogEvents";

class SideBarTabs extends Component {
  constructor() {
    super();

    this.state = {
      tabs: []
    };
    this.evalLoggerRef = null;
  }

  componentDidMount() {
    const tabs = [
      {
        id: "activities-tab",
        callback: this.props.selectSidebarTabActivities,
        name: "Chat",
        title: "Hier siehst du Chatnachrichten und Ereignisse"
        // extraContent: <ActivityCounter />
      },
      {
        id: "notes-tab",
        callback: this.props.selectSidebarTabNotes,
        name: "Notizen",
        title: "Bereich für persönliche Notizen"
      },
      {
        id: "annotations-tab",
        callback: this.props.selectSidebarTabAnnotations,
        name: "Annotationen",
        title: "Hier finden sich Sektionseinteilungen und andere Markierungen auf dem Video"
      }
    ];

    this.setState({ tabs });
  }

  render() {
    const selectedTabId = this.props.localState.sideBarTab.activeTab;


    const tabsEntries = this.state.tabs.map(tab => {
      const isSelected = selectedTabId === tab.id;
      var logEvent = null;
      switch (tab.id) {
        case "notes-tab":
          logEvent = NOTES_TAB;
          break;
        case "annotations-tab":
          logEvent = ANNOT_TAB;
          break;
        case "activities-tab":
          logEvent = CHAT_TAB;
          break;
        default:
          logEvent = CHAT_TAB;
      }

      return (
        <li title={tab.title} key={tab.id} className="nav-item primaryCol">
          <Interactive
            disabled={false}
            disabledMessage="Zurzeit nicht verfügbar..."
          >

            {this.props.assistent.actInstruction ? tab.id === "notes-tab" && this.props.assistent.active && this.props.assistent.actInstruction.markers === "notes-tab" ?
              <HintArrow
                style={{ position: "absolute", marginTop: 0, marginLeft: -110, zIndex: 1000 }}
                direction="right"
              /> : null : null}
            {this.props.assistent.actInstruction ? tab.id === "annotations-tab" && this.props.assistent.active && this.props.assistent.actInstruction.markers === "annotations-tab" ?
              <HintArrow
                style={{ position: "absolute", marginTop: 0, marginLeft: -80, zIndex: 1000 }}
                direction="right"
              /> : null : null}
            <a
              className={`nav-link ${isSelected ? " active prevent-pointer" : ""
                }`}
              id={tab.id}
              data-toggle="tab"
              href="#"
              role="tab"
              aria-controls={tab.id}
              aria-selected={isSelected ? "true" : "false"}
              onClick={()=>{this.evalLoggerRef.logToEvaluation(this.constructor.name, logEvent, ""), tab.callback()
             }}
            >
              {tab.name} {!!tab.extraContent ? tab.extraContent : null}
            </a>
          </Interactive>
        </li>
      );
    });

    return (
      <div>
        <EvalLogger createRef={el => (this.evalLoggerRef = el)} />
        <ul
          className="nav nav-tabs nav-justified"
          id="SideBarTabs"
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
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  {
    selectSidebarTabActivities,
    selectSidebarTabNotes,
    selectSidebarTabAnnotations
  }
)(SideBarTabs);
