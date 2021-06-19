// Video session controller that synchs all room clients, no matter what
import { Component } from "react";
import {
  sendSharedRoomData,
  ownSocketId,
  broadcastHeartBeat,
  subscribeToHeartBeat,
  unSubscribeHeartBeat
} from "../../../socket-handlers/api";
import { STALLED, READY, TIME_UPDATE } from "../AbstractVideoEvents";
import { VISIBILITY_CHANGED } from "../../logic-controls/genericAppEvents";
import { connect } from "react-redux";
import { updateRoomTime } from "../../../actions/roomActions";

// TODO: cleanup
class HardSyncController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastProcessedSyncAction: { mediaAction: "", time: -1, hash: -1 },
      readyState: { playerStalled: true, actionHash: "" },
      lastProcessedUpdateRequest: "",
      pendingUpdateRequest: false,
      readyToSync: false,
      sendingHeartBeats: false,
      appIsVisible: true
    };

    this.lastStateUpdateTimeOut;
    this.onPlayerStalled = this.onPlayerStalled.bind(this);
    this.onPlayerReadyToPlay = this.onPlayerReadyToPlay.bind(this);
    this.sendHeartBeat = this.sendHeartBeat.bind(this);
    this.onHeartBeat = this.onHeartBeat.bind(this);
    this.onAppVisibilityChanged = this.onAppVisibilityChanged.bind(this);
    this.shareOwnReadyState = this.shareOwnReadyState.bind(this);
    this.checkReadyToSyncAfterInitialPlay = this.checkReadyToSyncAfterInitialPlay.bind(
      this
    );
  }

  // player is initialized
  componentDidMount() {
    this.props.onRef(this);
    this.player = this.props.playerRef.current;
    this.playBack = this.props.playBackRef.current;

    this.player.on(STALLED, this.onPlayerStalled);
    this.player.on(READY, this.onPlayerReadyToPlay);

    window.genericAppEvents.add(
      VISIBILITY_CHANGED,
      this.onAppVisibilityChanged
    );

    subscribeToHeartBeat(this.onHeartBeat);

    // check if we joined a running session and need to request for an update
    const currentSyncAction = this.getCurrentSynchAction();
      

    if (
      currentSyncAction != null &&
      Object.keys(this.getSharedRoomData().clients).length > 1
    ) {

      this.player.playCurrent();
      setTimeout(() => {
        this.player.on(TIME_UPDATE, this.checkReadyToSyncAfterInitialPlay);
      }, 100);
    } else {
      this.readyToSync();
    }

  }

  checkReadyToSyncAfterInitialPlay(time) {
    if (time > 1) {
      this.player.off(TIME_UPDATE, this.checkReadyToSyncAfterInitialPlay);
      console.log("TIME BEFORE READY TO SYNC", time);
      this.readyToSync();
    }
  }

  readyToSync() {
    this.setState({ readyToSync: true });

    // const currentSyncAction = this.getCurrentSynchAction();
    const validAnswerClient = this.getFirstClientInSyncSpace(ownSocketId());

    if (validAnswerClient) this.requestCurrentTime(true);
    else
      this.shareSyncAction(
        this.player.getMediaAction(),
        this.player.getCurrentTime()
      );
  }

  leftSyncSpace() {
    this.setState({ readyToSync: false });
    this.activateHeartBeatBroadcasting(false);
  }

  // initialSyncCompleted() {
  //   console.log("register to heartbeat");

  //   // subscribeToHeartBeat(this.onHeartBeat);
  //   this.setState({ readyToSync: true });
  // }

  componentWillUnmount() {
    this.props.onRef(null);
    unSubscribeHeartBeat();
    this.activateHeartBeatBroadcasting(false);
    if (this.player) {
      this.player.off(STALLED, this.onPlayerStalled);
      this.player.off(READY, this.onPlayerReadyToPlay);
    }

    window.genericAppEvents.remove(
      VISIBILITY_CHANGED,
      this.onAppVisibilityChanged
    );
  }

  onAppVisibilityChanged(visible, state) {
    this.setState({ appIsVisible: visible });
  }

  onPlayerStalled() {
    //console.log("I'm STALLED");
    const { actionHash } = this.state.readyState;
    this.checkAndUpdateReadyState(actionHash);
  }

  onPlayerReadyToPlay() {
    const { actionHash } = this.state.readyState;
    this.checkAndUpdateReadyState(actionHash);
  }

  render() {
    return null;
  }

  onPlayRequest() {
    // this.player.play(this.player.getCurrentTime());
    console.log("playrequest");
    this.shareSyncAction("play", this.player.getCurrentTime());
  }

  onPauseRequest() {
    // this.player.pause(this.player.getCurrentTime());
    this.player.pauseCurrent();
    this.shareSyncAction("pause", this.player.getCurrentTime());
  }

  onSeekRequest(targetTime) {
    // this.player.pause(targetTime);
    this.shareSyncAction("pause", targetTime);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      // we are back in sync => request current time
      this.readyToSync();
      return;
    } else if (this.props.active && !nextProps.active) {
      this.leftSyncSpace();
      return;
    }

    const { roomAvailable } = nextProps.roomState;

    // console.log("ROOM AVAILABLE", roomData);
    if (roomAvailable) this.processPropsUpdate();
  }

  processPropsUpdate() {
    const syncAction = this.getCurrentSynchAction();

    // console.log("synchAction", syncAction);

    if (syncAction === null || !this.state.readyToSync) return;

    this.checkForUpdateRequests(
      this.props.roomState.roomData.state.sharedRoomData
    );
    this.processSyncActionsByClientsState(syncAction);
    const { mediaAction, hash } = syncAction;

    const lastSyncAction = this.state.lastProcessedSyncAction;
    if (lastSyncAction.hash === hash) return;

    switch (mediaAction) {
      case "play": // play will be triggered if all players are ready
      case "pause":
        this.handleSharedTimeUpdate(syncAction);
        break;
    }

    this.setState({
      lastProcessedSyncAction: syncAction,
      pendingUpdateRequest: false
    });
  }

  handleSharedTimeUpdate(syncAction) {
    const { time, hash } = syncAction;

    // todo: works?
    // this.player.once(TIME_UPDATE, () => {
    //   setTimeout(() => {
    //     this.checkAndUpdateReadyState(hash);
    //   }, 200);
    // });

    this.player.pause(time, () => {
      console.log("paused hash", hash);
      // player has paused and frame is loaded and shown
      this.checkAndUpdateReadyState(hash);
    });
  }

  // updates my own readystate
  checkAndUpdateReadyState(_actionHash) {
    if (!this.props.active || this.player.isScrubbing()) return;

    const { playerStalled, actionHash } = this.state.readyState;
    if (
      playerStalled === this.player.isStalled() &&
      actionHash === _actionHash
    ) {
      return;
    }

    const newReadyState = {
      playerStalled: this.player.isStalled(),
      actionHash: _actionHash
    };

    this.setState({ readyState: newReadyState });

    // if (this.lastStateUpdateTimeOut) clearTimeout(this.lastStateUpdateTimeOut);

    // prevent many updates
    // if (!newReadyState.playerStalled) {
    //   this.lastStateUpdateTimeOut = setTimeout(() => {
    //     this.shareOwnReadyState();
    //   }, 1000);
    // } else {
    this.shareOwnReadyState(newReadyState);
    // }

    // console.log(
    //   "new state, broadcast",
    //   this.state.readyState,
    //   this.player.isStalled(),
    //   _actionHash
    // );

    // console.log("SHARE READY STATE  --------------------------------------");

    //console.log("I BROADCASTED", this.state.readyState);
  }

  shareOwnReadyState(newReadyState) {
    sendSharedRoomData(this.props.roomId, "readyState", newReadyState, true);
  }

  // handles play if all players are ready
  // precondition: player stopped on the corresponding time
  processSyncActionsByClientsState(syncAction) {
    const { mediaAction, hash, sender } = syncAction;
    const ownSocketIdVal = ownSocketId();

    // TODO: if heartbeatsender leaves => define other sender
    const { roomData } = this.props.roomState;
    const sharedRoomData = roomData.state.sharedRoomData;

    this.activateHeartBeatBroadcasting(
      mediaAction === "play" &&
      this.getFirstClientInSyncSpace() === ownSocketIdVal
    );
    if (mediaAction !== "play") return;

    const clients = sharedRoomData.clients;
    const clientsArray = Object.keys(clients);

    var allClientsReadyToPlay = true;
    // process play action if all clients ready
    for (let i = 0; i < clientsArray.length; i++) {
      const clientId = clientsArray[i];

      const clientData = clients[clientId];

      // ignore users who work async
      if (clientData.getAtPath("remoteState.syncState.sync", true) === false)
        continue;

      if ("readyState" in clientData) {
        const { actionHash, playerStalled } = clientData.readyState;

        if (actionHash !== hash || playerStalled) allClientsReadyToPlay = false;
      } else allClientsReadyToPlay = false;
    }

    if (this.player.isPaused() && allClientsReadyToPlay) {
      this.player.playCurrent();
    } else if (!allClientsReadyToPlay && !this.player.isPaused())
      this.player.pauseCurrent();
  }

  shareSyncAction(mediaAction, time) {
    const syncAction = {
      sender: ownSocketId(),
      mediaAction: mediaAction,
      time: time,
      hash: Math.random()
    };

    sendSharedRoomData(this.props.roomId, "syncAction", syncAction, false);
  }

  getCurrentSynchAction() {
    const { roomAvailable, roomData } = this.props.roomState;
    if (roomAvailable && "syncAction" in roomData.state.sharedRoomData) {
      return roomData.state.sharedRoomData.syncAction;
    }
    return null;
  }

  getSharedRoomData() {
    const { roomAvailable, roomData } = this.props.roomState;
    if (roomAvailable) {
      return roomData.state.sharedRoomData;
    }
    return null;
  }

  // we need an update about the synch time because...
  // we are new or out of sync
  requestCurrentTime(force = false) {
    // const currentSyncAction = this.getCurrentSynchAction();
    // if (currentSyncAction && currentSyncAction.mediaAction === "pause") {
    //   this.processPropsUpdate();
    //   return;
    // }

    if (!force && this.state.pendingUpdateRequest) return;

    this.setState({ pendingUpdateRequest: true });

    // in response to this update request the sender of the last media action or
    // the first user will send an media action update
    sendSharedRoomData(
      this.props.roomId,
      "updateRequest",
      { requester: ownSocketId(), hash: Math.random() },
      false
    );
  }

  isClientInAsyncMode(sharedRoomData, clientId) {
    const clientData = sharedRoomData.clients[clientId];
    return (
      clientData &&
      clientData.getAtPath("remoteState.syncState.sync", true) === false
    );
  }

  getFirstClientInSyncSpace(excludeClientId) {
    const { sharedRoomData } = this.props.roomState.roomData.state;
    const clientsArray = Object.keys(sharedRoomData.clients);
    for (let i = 0; i < clientsArray.length; i++) {
      const clientId = clientsArray[i];

      if (
        clientId !== excludeClientId &&
        !this.isClientInAsyncMode(sharedRoomData, clientId)
      )
        return clientId;
    }

    return null;
  }

  checkForUpdateRequests(sharedRoomData) {
    if (
      sharedRoomData.updateRequest &&
      sharedRoomData.clients &&
      sharedRoomData.updateRequest.requester !== ownSocketId() &&
      sharedRoomData.updateRequest.hash !==
      this.state.lastProcessedUpdateRequest
    ) {
      const needToAnswer =
        this.getFirstClientInSyncSpace(
          sharedRoomData.updateRequest.requester
        ) == ownSocketId();
      // the oldest valid (!asyncMode) client has to answer the request

      if (needToAnswer) {
        // repeat last media action
        const targetMediaAction = sharedRoomData.syncAction
          ? sharedRoomData.syncAction.mediaAction
          : this.player.getMediaAction();
        sendSharedRoomData(this.props.roomId, "updateRequest", null, false);
        this.setState({
          lastProcessedUpdateRequest: sharedRoomData.updateRequest.hash
        });
        this.shareSyncAction(targetMediaAction, this.player.getCurrentTime());
      }
    }
  }

  activateHeartBeatBroadcasting(activate) {
    if (this.state.sendingHeartBeats === activate) return;

    clearInterval(this.heartBeatInterval);
    if (activate)
      this.heartBeatInterval = setInterval(this.sendHeartBeat, 10000);

    this.setState({ sendingHeartBeats: activate });
  }

  sendHeartBeat() {
    // since network data will be delayed if minimized we will not send heartbeat
    if (this.player.isScrubbing() || !this.state.appIsVisible) return;
    console.log("SendingHeartbeat");

    broadcastHeartBeat(this.props.roomId, this.player.getCurrentTime());
  }

  onHeartBeat(time) {
    // If we are async we want to know at least the appropriate position of the group
    // if (!this.props.localState.syncState.sync) {
    this.props.updateRoomTime(this.props.roomId, time);
    //   return;
    // }

    if (
      !this.props.active ||
      this.player.isScrubbing() ||
      !this.state.appIsVisible ||
      !this.state.readyToSync
    )
      return;
    const timeDifference = Math.abs(time - this.player.getCurrentTime());

    if (timeDifference > 0.7) {
      this.player.fixTime(time);
    }
  }
}

HardSyncController.defaultProps = {
  active: true
};

const mapStateToProps = state => ({
  rooms: state.rooms,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { updateRoomTime }
)(HardSyncController);
