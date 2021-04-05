import { connect } from "react-redux";
import React, { Component } from "react";
import { ownSocketId } from "../../socket-handlers/api";
import classnames from "classnames";
import TransientAwareness from "./TransientAwareness";
import ClientName from "../controls/ClientName";
import VideoStream from "../peer-components/VideoStream";
import "./user-list.css";
// import { connectToAll } from "../../p2p-handlers/P2PConnectionManager";
import { joinConference} from "../test/WebRtcConference";
import { OWN_ACTIVE_MEDIA_CHANGED } from "../../stream-model/streamEvents";
import PhaseReadyIndicator from "../../ScriptedCooperation/controlComponents/PhaseReadyIndicator";
import HintArrow from "../Assistent/HintArrow";

class UserListItemSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      syncState: "init",
      ownMediaConfig: { audio: false, video: false } // only set for own entry
    };

    this.onOwnStreamMediaChanged = this.onOwnStreamMediaChanged.bind(this);
  }

  componentWillMount() {
    if (ownSocketId() === this.props.clientId) {
      window.streamEvents.add(
        OWN_ACTIVE_MEDIA_CHANGED,
        this.onOwnStreamMediaChanged
      );
    }
  }

  componentWillUnmount() {
    if (ownSocketId() === this.props.clientId) {
      window.streamEvents.remove(
        OWN_ACTIVE_MEDIA_CHANGED,
        this.onOwnStreamMediaChanged
      );
    }
  }

  onOwnStreamMediaChanged(streamRoomId, parentRoomId, mediaConfig) {
    if (this.roomData.state.roomId === parentRoomId)
      this.setState({ ownMediaConfig: mediaConfig });
  }

  componentWillReceiveProps(nextProps) {
    this.roomData = nextProps.roomData;

    this.sharedRoomData = this.roomData.state.sharedRoomData;
    this.client = this.roomData.state.sharedRoomData.clients[
      nextProps.clientId
    ];

    const { syncAction } = this.sharedRoomData;

    if ("readyState" in this.client) {
      const { readyState } = this.client;
      if (readyState.playerStalled) {
        this.updateSyncState("stall");
      } else if (syncAction && syncAction.hash !== readyState.actionHash) {
        this.updateSyncState("wait");
      } else this.updateSyncState("sync");
    } else {
      this.updateSyncState("init");
    }
  }

  updateSyncState(state) {
    if (this.state.syncState !== state) this.setState({ syncState: state });
  }

  renderPlayBackIcon() {
    const { syncAction } = this.sharedRoomData;
    if (syncAction) {
      const { sender, mediaAction } = syncAction;

      if (this.props.clientId !== sender) return null;

      return (
        // <i className="fa fa-play-circle" style={{ color: "#007bff" }} />
        <i title="Videoaktivitäten"
          className={classnames("fa ml-1", {
            "fa-play-circle": mediaAction === "play",
            "fa-pause-circle": mediaAction === "pause"
          })}
          style={{ color: "#000000" }}
        />
      );
    } else return null;
  }

  onActivateStream(video, audio) {
    // connectToAll(this.roomData.state.roomId);
    joinConference(this.roomData.state.roomId, video, audio);
  }

  getLocalClientMediaButtons() {
    const hasVideoActive = this.state.ownMediaConfig.video;
    const hasAudioActive = this.state.ownMediaConfig.audio;

    return (
      <span>
        <button
          className={classnames("btn primaryCol btn-sm ml-1", {
            "hidden-nosize": hasVideoActive
          })}
          onClick={this.onActivateStream.bind(this, true, true)}
          title="Starte Audio- und Videostream"
        >
          {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.actInstruction.markers === "video-button" ?
            <HintArrow
              style={{ position: "absolute", top: -5, right:50 }}
              direction="right"
            /> : null:null}
          <i id="video-button" className="fa fa-video" style={{ color: "#FFF" }} />
        </button>
     
        <button
          className={classnames("btn primaryCol btn-sm ml-1", {
            "hidden-nosize": hasAudioActive && !hasVideoActive
          })}
          onClick={this.onActivateStream.bind(this, false, true)}
          title="Starte Audio-Streaming"
        >
             {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.actInstruction.markers === "audio-button" ?
            <HintArrow
              style={{ position: "absolute", top: -5, right:20 }}
              direction="right"
            /> : null:null}
          <i id="audio-button" className="fa fa-microphone" style={{ color: "#FFF" }} />
        </button>

        <button
          className={classnames("btn btn-danger btn-sm ml-1", {
            "hidden-nosize": !hasAudioActive && !hasVideoActive
          })}
          onClick={this.onActivateStream.bind(this, false, false)}
          title="Stop streaming"
        >
          <i
            className={classnames("fa", {
              "fa-video-slash": hasVideoActive,
              "fa-microphone-slash": hasAudioActive && !hasVideoActive
            })}
            style={{ color: "#FFF" }}
          />
        </button>
      </span>
    );
  }

  render() {
    if (!this.client) return null;

    const clientId = this.props.clientId;
    const isOwn = ownSocketId() === clientId;
    const { syncState } = this.state;
    const roomId = this.roomData.state.roomId;

    /**
     * Check users view space. Priority: absent, shared editor, annotation, film/frame
     */
    var usersViewSpaceIcon = "fa-film";
    var viewSpaceHint = "Der Benutzer hat den Fokus auf dem Video";

    // is user absent?
    const isAppInFocus = isOwn
      ? this.props.localState.focusState.appInFocus
      : this.props.rooms.getAtPath(
        `rooms.${roomId}.state.sharedRoomData.clients.${clientId}.remoteState.focusState.appInFocus`,
        true
      );

    if (!isAppInFocus) {
      usersViewSpaceIcon = "fa-eye-slash";
      viewSpaceHint = "Der Benutzer ist abgelenkt";
    } else {
      const isViewingGuide = isOwn
        ? this.props.localState.guide.isOpen
        : this.props.rooms.getAtPath(
          `rooms.${roomId}.state.sharedRoomData.clients.${clientId}.remoteState.guide.isOpen`,
          false
        );

      // user looking at guide?
      if (isViewingGuide) {
        usersViewSpaceIcon = "fa-info-circle";
        viewSpaceHint = "Der Benutzer ließt gerade den Guide";
      } else {
        const isViewingSharedDoc = isOwn
          ? this.props.localState.sharedDocEditing.isOpen
          : this.props.rooms.getAtPath(
            `rooms.${roomId}.state.sharedRoomData.clients.${clientId}.remoteState.sharedDocEditing.isOpen`,
            false
          );

        // user shared doc ?
        if (isViewingSharedDoc) {
          usersViewSpaceIcon = "fa-file-alt";
          viewSpaceHint = "Der Benutzer schaut sich gerade das Dokument an";
        } else {
          // user edits annotation ?
          const isViewingAnnotationEditor = isOwn
            ? !!this.props.localState.annotationEditing
            : !!this.props.rooms.getAtPath(
              `rooms.${roomId}.state.sharedRoomData.clients.${clientId}.remoteState.annotationEditing`,
              false
            );

          if (isViewingAnnotationEditor) {
            usersViewSpaceIcon = "fa-map-marker";
            viewSpaceHint = "Der Benutzer setzt gerade Markierungen im Video";
          }
        }
      }
    }

    const isSync = isOwn
      ? this.props.localState.syncState.sync
      : this.props.rooms.getAtPath(
        `rooms.${roomId}.state.sharedRoomData.clients.${clientId}.remoteState.syncState.sync`,
        true
      );

    var targetStateStyle;

    if (!isSync) {
      targetStateStyle = "badge-danger";
    } else {
      switch (syncState) {
        case "sync":
          targetStateStyle = "badge-success";
          break;

        case "wait":
        case "init":
          targetStateStyle = "badge-warning";
          break;

        default:
          targetStateStyle = "badge-danger";
          break;
      }
    }

    const stateBadge = (
      <span title="Zeigt an, ob synchron oder " className={`badge  mr-1 ${targetStateStyle}`}>
        {isSync ? syncState : <del>sync</del>}
      </span>
    );

    const streamRoomId = roomId + "_stream";

    const isJoinedStreamRoom = streamRoomId in this.props.rooms.rooms;

    const isClientInStreamRoom =
      isJoinedStreamRoom &&
      clientId in
      this.props.rooms.rooms[streamRoomId].state.sharedRoomData.clients;

    var streamContent = isClientInStreamRoom ? (
      <VideoStream roomId={streamRoomId} clientId={clientId} />
    ) : null;

    return (
      <div id="awareness-partner"
        key={clientId}
        className={classnames("session-user-item", {
          "session-user-item-own": isOwn
        })}
      >
         {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.actInstruction.markers === "awareness-partner"&&!isOwn ?
            <HintArrow
              style={{ position: "absolute", marginTop:-70}}
              direction="down"
            /> : null:null}
        
        
        <span className="sessionuser-item-info">
          <span>
            <PhaseReadyIndicator
              sharedData={this.roomData.state.sharedRoomData}
              clientId={clientId}
            
            />
            {/*stateBadge*/}
            <ClientName
              roomData={this.roomData}
              clientId={clientId}
              allowRoleIcon={true}
              isOwn={isOwn}
            />
            <i
              className={`viewspace-indicator fa ${usersViewSpaceIcon}`}
              title={viewSpaceHint}
            />
            <TransientAwareness roomData={this.roomData} clientId={clientId} />
            {this.renderPlayBackIcon()}
          </span>
          {clientId === ownSocketId()
            ? this.getLocalClientMediaButtons()
            : null}
        </span>
        <div>{streamContent}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  localState: state.localState,
  assistent: state.assistent
});

export default connect(mapStateToProps)(UserListItemSession);
