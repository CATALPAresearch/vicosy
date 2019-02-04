import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectSidebarTabActivities,
  selectSidebarTabNotes,
  selectSidebarTabAnnotations
} from "../../../actions/localStateActions";
// import ActivityCounter from "../../chat/ActivityCounter";
import "./sidebar-tabs.css";

class SideBarTabs extends Component {
  constructor() {
    super();

    this.state = {
      tabs: []
    };
  }

  componentDidMount() {
    const tabs = [
      {
        id: "activities-tab",
        callback: this.props.selectSidebarTabActivities,
        name: "Activities"
        // extraContent: <ActivityCounter />
      },
      {
        id: "notes-tab",
        callback: this.props.selectSidebarTabNotes,
        name: "Notes"
      },
      {
        id: "annotations-tab",
        callback: this.props.selectSidebarTabAnnotations,
        name: "Annotations"
      }
    ];

    this.setState({ tabs });
  }

  render() {
    const selectedTabId = this.props.localState.sideBarTab.activeTab;

    const tabsEntries = this.state.tabs.map(tab => {
      const isSelected = selectedTabId === tab.id;

      return (
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
  localState: state.localState
});

export default connect(
  mapStateToProps,
  {
    selectSidebarTabActivities,
    selectSidebarTabNotes,
    selectSidebarTabAnnotations
  }
)(SideBarTabs);
