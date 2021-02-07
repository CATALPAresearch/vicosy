import React, { Component } from "react";
import { connect } from "react-redux";
// import VideoPlayer from "./VideoPlayer/VideoPlayer";

// import VideoLocator from "./VideoLocator";
import RoomComponent from "../controls/RoomComponent";
import UserList from "../../components/userlist/UserList";
import UserListItemSession from "../../components/userlist/UserListItemSession";
import Chat from "../../components/chat/Chat";
import VideoSessionController from "./VideoSessionController";
import AbstractVideo from "./AbstractVideo";
import PlayBackInterface from "./PlayBackControls/PlayBackInterface";
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  ROOM_JOINED
} from "../logic-controls/socketEvents";
import { withRouter } from "react-router";
import { setError } from "../../actions/errorActions";
import { joinConference, leaveConference } from "../test/WebRtcConference";
import { ownSocketId } from "../../socket-handlers/api";
import { resetLocalState } from "../../actions/localStateActions";

// import "../../p2p-handlers/P2PConnectionManager";

import "./VideoSession.css";

import VideoCanvas from "./VideoCanvas/VideoCanvas";
import Observable from "../../utils/observable";
import Logger from "../logic-controls/Logger";
import AnnotationController from "../logic-controls/AnnotationController";
import SessionNavbar from "./SessionNavbar/SessionNavbar";
// import SharedDoc from "./TextCollaboration/SharedDoc";
import SharedDoc from "./SharedDoc/SharedDoc";
import AnnotationDetail from "./Annotation/AnnotationDetail";
import InnerShadow from "../layout/InnerShadow";
import classnames from "classnames";
import CollaborationBar from "./CollaborationBar/CollaborationBar";
import sessionTypes from "../../shared_constants/sessionTypes";
import RoomContextDataProvider from "../../highOrderComponents/RoomContextDataProvider";
import IndividualNotes from "./Sidebar/IndividualNotes/IndividualNotes";
import PersonalNotes from "./Sidebar/PersonalNotes/PersonalNotes"
import SideBarTabs from "./Sidebar/SideBarTabs";
import ChildrenRenderer from "../controls/ChildrenRenderer";
import AnnotationOverview from "./Sidebar/AnnotationOverview/AnnotationOverview";
import { withLastLocation } from "react-router-last-location";
import LoadingIndicatorContainer from "./LoadingIndicator/LoadingIndicatorContainer";
import Guide from "./Guide/Guide";
import { getScriptByGroupId } from "../../actions/scriptActions";

class VideoSession extends Component {
  constructor(props) {
    super(props);

    // Chrome doesn't allow autoplay for video if the user didn't interact with the document before => special handling
    // Update: Since FF does have the same behaviour now, Chrome check was removed
    var userReady =
      /*navigator.userAgent.indexOf("Chrome") === -1 ||*/
      this.props.lastLocation !== null;

    this.abstractPlayerRef = React.createRef();
    window.playerRef = this.abstractPlayerRef;
    this.playBackInterfaceRef = React.createRef();
    this.state = {
      sessionAvailable: false,
      sessionMeta: null,
      userReady,
      containerId: "Container"
    };

    this.onRoomJoined = this.onRoomJoined.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    window.sessionEvents = new Observable();
  }

  componentDidMount() {
    // this.props.loginRoom(this.props.match.params.sessionId);
    if (this.state.userReady) {
      this.initialize();
    }
  }

  initialize() {

    this.props.getScriptByGroupId(this.props.match.params.sessionId, () => {
      window.socketEvents.add(ROOM_JOINED, this.onRoomJoined);
      window.socketEvents.dispatch(JOIN_ROOM, this.props.match.params.sessionId);
      this.updateRoomState(this.props);
    });

  }

  componentWillUnmount() {
    const { sessionId } = this.props.match.params;
    // this.props.logoutRoom(this.props.match.params.sessionId);
    window.socketEvents.remove(ROOM_JOINED, this.onRoomJoined);

    window.socketEvents.dispatch(LEAVE_ROOM, sessionId);
    window.socketEvents.dispatch(LEAVE_ROOM, sessionId + "_stream");
    window.sessionEvents = null;
    window.playerRef = null;

    this.props.resetLocalState();
  }

  onRoomJoined(roomId) {
    const { sessionId } = this.props.match.params;
    if (roomId === sessionId) {
      // TODO: why timeout needed here?
      setTimeout(() => {
        joinConference(sessionId, false, false);
      }, 100);
    }
  }

  componentWillReceiveProps(newProps) {
    this.updateRoomState(newProps);
  }

  updateRoomState(props) {
    const { sessionId } = this.props.match.params;

    if (sessionId in props.errors && "roomReject" in props.errors[sessionId]) {
      window.activeSessionId = 0;
      this.setState({ sessionAvailable: false });
      props.history.push("/studentlobby");
      this.props.setError("warning", props.errors[sessionId].reason);
      return;
    }

    if (
      sessionId in props.rooms.rooms &&
      "sharedRoomData" in props.rooms.rooms[sessionId].state &&
      "meta" in props.rooms.rooms[sessionId].state.sharedRoomData
    ) {
      window.activeSessionId = sessionId; // todo: check if this should be moved to reducer
      this.setState({
        sessionAvailable: true,
        sessionMeta: props.rooms.rooms[sessionId].state.sharedRoomData.meta
      });
    } else {
      window.activeSessionId = 0;
      this.setState({ sessionAvailable: false });
    }
  }

  getOwnUserData() {
    const { sessionId } = this.props.match.params;

    if (
      sessionId in this.props.rooms.rooms &&
      ownSocketId() in
      this.props.rooms.rooms[sessionId].state.sharedRoomData.clients
    )
      return this.props.rooms.rooms[sessionId].state.sharedRoomData.clients[
        ownSocketId()
      ];
    else return null;
  }

  getTargetPlayerComponent() { }
  /*assistentLayout() {
    this.setState({ containerId: "ContainerAssitent" });

  };
  normalLayout() {
    this.setState({ containerId: "Container" });

  };*/

  render() {
    /* if (this.props.assistent.active)
       this.assistentLayout();
     else
       this.normalLayout();*/
    const { sessionId } = this.props.match.params;

    const contentDocInteractionRequired = (
      <h1>
        Continue to session{" "}
        <button
          onClick={() => {
            this.setState({ userReady: true });
            this.initialize();
          }}
          className="btn btn-success"
        >
          continue
        </button>
      </h1>
    );

    const contentPreparing = <h1>Preparing session...</h1>;

    const requiresCollaborationBar =
      this.state.sessionMeta &&
      this.state.sessionMeta.sessionType !== sessionTypes.SESSION_DEFAULT;

    const contentDataAvailable = (
      <div id={this.props.assistent.active ? "ContainerAssistent" : "Container"
      }>
        <RoomContextDataProvider roomId={sessionId}>
          {/* <RoomComponent roomId={sessionId} component={P2PController} /> */}
          {/* invisible controllers */}
          <Logger roomId={sessionId} />
          <AnnotationController
            roomId={sessionId}
            playerRef={this.abstractPlayerRef}
          />

          <div id="SideBar">
            <RoomComponent
              roomId={sessionId}
              component={UserList}
              userListItemComponent={UserListItemSession}
            />
            <SideBarTabs />
            <div className="sidebar-bottom-contents">
              <RoomComponent
                roomId={sessionId}
                component={Chat}
                visible={
                  this.props.localState.sideBarTab.activeTab ===
                  "activities-tab"
                }
              />
              {/*
              <IndividualNotes
                visible={
                  this.props.localState.sideBarTab.activeTab === "notes-tab"
                }
                roomId={sessionId}
              />
              */}
              <PersonalNotes
                visible={
                  this.props.localState.sideBarTab.activeTab === "notes-tab"
                }
                roomId={sessionId}
              />
              <AnnotationOverview
                visible={
                  this.props.localState.sideBarTab.activeTab ===
                  "annotations-tab"
                }
              />
            </div>
          </div>
          <div id="VideoMain">
            {

              requiresCollaborationBar ? (
                <RoomComponent roomId={sessionId} component={CollaborationBar} />
              ) : null}
            <SessionNavbar playerRef={this.abstractPlayerRef} />
            <div
              id="VideoSection"
              className={classnames("", {
                "hidden-nosize": this.props.localState.sharedDocEditing.isOpen,
                videoHeightOffsetWithoutCollaborationBar: !requiresCollaborationBar,
                videoHeightOffsetWithCollaborationBar: requiresCollaborationBar
              })}
            >
              <div id="Content">
                <AbstractVideo
                  ref={this.abstractPlayerRef}
                  // component={VideoPlyrHTML5}
                  overlayComponent={VideoCanvas}
                  roomId={sessionId}
                  sessionEvents={window.sessionEvents}
                />
                <LoadingIndicatorContainer />
              </div>
              <div className="vFlexLayout playback-interface">
                <PlayBackInterface
                  ref={this.playBackInterfaceRef}
                  playerRef={this.abstractPlayerRef}
                  roomId={sessionId}
                  sessionEvents={window.sessionEvents}
                />
              </div>
              <InnerShadow
                cssClasses={classnames("", {
                  "inner-shadow-red fadeOutAnim": !this.props.localState
                    .syncState.sync,
                  "inner-shadow-green fadeOutAnim2": this.props.localState
                    .syncState.sync
                })}
              />
            </div>
            <AnnotationDetail
              roomId={sessionId}
              playerRef={this.abstractPlayerRef}
              useOffset={requiresCollaborationBar}
            />
            <SharedDoc
              roomId={sessionId}
              ownUserData={this.getOwnUserData()}
              useOffset={requiresCollaborationBar}
            />
            <Guide roomId={sessionId} />
          </div>

          <RoomComponent
            roomId={sessionId}
            component={VideoSessionController}
            playerRef={this.abstractPlayerRef}
            playBackRef={this.playBackInterfaceRef}
            sessionEvents={window.sessionEvents}
          />
        </RoomContextDataProvider>
      </div>
    );

    const available = this.state.sessionAvailable;
    const targetContent = this.state.userReady
      ? available
        ? contentDataAvailable
        : contentPreparing
      : contentDocInteractionRequired;

    return targetContent;
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  errors: state.errors,
  localState: state.localState,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { setError, resetLocalState, getScriptByGroupId }
)(withRouter(withLastLocation(VideoSession)));
