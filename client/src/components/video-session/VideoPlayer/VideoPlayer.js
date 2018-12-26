import React, { Component } from "react";
import "videojs-youtube";
import videojs from "video.js";
import "./video-js.css";
import "./video-js-custom.css";
import PlayBackControls from "../PlayBackControls/PlayBackControls";
import {
  sendSharedRoomData,
  ownSocketId,
  shareTransientAwareness
} from "../../../socket-handlers/api";

const readyStateEvents = [
  "abort",
  "playing",
  "canplay",
  "canplaythrough",
  "error",
  "wait"
];
// sourround with RoomComponent
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxPlayTime: 100,
      currentPlayTime: 0,
      lastProcessedHash: "",
      readyState: { playerReadyState: 0, actionHash: "" },
      pendingTimeRequest: false,
      initialized: false // are we initially in sync?
    };
  }

  componentDidMount() {
    // instantiate Video.js
    // this.reCreatePlayer("https://www.youtube.com/watch?v=ccCcAln7Qco&t=1s");
    this.tryInitializePlayer("Component mount");
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.removePlayerListeners();
      this.player.dispose();
      this.player = null;
    }
  }

  reCreatePlayer(url) {
    if (this.player) {
      this.removePlayerListeners();
      this.player.dispose();
    }

    const videoJsOptions = {
      preload: "auto",
      autoplay: false,
      controls: false,
      techOrder: ["youtube"],
      sources: [
        {
          src: url,
          type: "video/youtube" //type: 'video/mp4'
        }
      ]
    };

    this.player = videojs(this.videoNode, videoJsOptions);

    // if the session has not begone => we are initialized
    // otherwise we have to start the player and request current playtime
    // to be initialized afterwards
    this.setState({ initialized: !this.syncActionAvailable() });

    this.player.ready(() => {
      this.player.on("loadedmetadata", () => {
        // console.log("METADATA -----------------");
      });

      // sync actions already fired (active session)
      // request to give me an update
      if (!this.state.initialized) {
        this.player.one("playing", () => {
          setTimeout(() => {
            this.setState({ initialized: true });
            this.requestCurrentTime();
          }, 1000);
        });
        // we need to play to be initialized
        // (required for some platforms to get metadata)
        this.player.play();
      }

      this.player.on("durationchange", () => {
        // console.log("DURATION", this.player.duration());
        this.setState({ maxPlayTime: this.player.duration() });
      });

      this.player.on("timeupdate", () => {
        //console.log("Time", this.player.currentTime());

        this.setState({ currentPlayTime: this.player.currentTime() });

        //console.log(this.state);
      });

      this.addPlayerListeners();
    });
  }

  syncActionAvailable() {
    const { roomAvailable, roomData } = this.props.roomState;
    return roomAvailable && "syncAction" in roomData.state.sharedRoomData;
  }

  // Initializes the player if shared room data available
  tryInitializePlayer(source) {
    const { roomAvailable, roomData } = this.props.roomState;

    console.log("try INITIALIZE", source);

    if (roomAvailable && !this.player && roomData.state.sharedRoomData.meta) {
      const { videoUrl } = roomData.state.sharedRoomData.meta;
      this.reCreatePlayer(videoUrl);
      console.log("INITIALIZE", true);
    } else {
      // if metadata not available => session gone
      console.log("INITIALIZE", roomAvailable, this.player, roomData);
    }
  }

  // we need an update about the synch time because...
  // we are new or out of sync
  requestCurrentTime() {
    if (this.state.pendingTimeRequest) return;

    this.setState({ pendingTimeRequest: true });

    // in response to this update request the sender of the last media action or
    // the first user will send an media action update
    sendSharedRoomData(
      this.props.roomId,
      "updateRequest",
      ownSocketId(),
      false
    );
  }

  addPlayerListeners() {
    //this.removePlayerListeners();
    // can be triggered by code or user
    this.player.on("play", this.onPlayerEventPlay.bind(this));

    // can be triggered by code or user
    this.player.on("pause", this.onPlayerEventPause.bind(this));
    this.player.on("timeupdate", this.onPlayerTimeUpdate.bind(this));
    this.player.on(readyStateEvents, this.onReadyStateChange.bind(this));
  }

  removePlayerListeners() {
    // can be triggered by code or user
    this.player.off("play");

    // can be triggered by code or user
    this.player.off("pause");
    this.player.off("timeupdate");
    this.player.off(readyStateEvents);
  }

  onReadyStateChange() {
    const newPlayerReadyState = this.player.readyState();
    // console.log("READY STATE", newPlayerReadyState);

    const { actionHash } = this.state.readyState;

    const currentSyncHash = this.getCurrentSynchActionHash();
    if (currentSyncHash === actionHash)
      this.checkAndUpdateReadyState(actionHash);
  }

  checkAndUpdateReadyState(_actionHash) {
    const { playerReadyState, actionHash } = this.state.readyState;
    if (
      playerReadyState === this.player.readyState() &&
      actionHash === _actionHash
    )
      return;

    const newReadyState = {
      playerReadyState: this.player.readyState(),
      actionHash: _actionHash
    };

    // todo: timeout?
    this.setState({ readyState: newReadyState });
    // console.log("SHARE READY STATE  --------------------------------------");

    sendSharedRoomData(
      this.props.roomId,
      "readyState",
      this.state.readyState,
      true
    );
  }

  onPlayerEventPause(e) {
    console.log("! PLAYER PAUSE !", e);
    //this.onStopClick();
  }

  onPlayerEventPlay(e) {
    //this.onPlayClick();
    // hack
    if (this.state.initialized) {
      const syncAction = this.getCurrentSynchAction();
      if (syncAction == null || syncAction.mediaAction !== "play") {
        this.player.pause();
      }
    }
  }

  onPlayerTimeUpdate() {
    // console.log("! TIME UPDATE !", this.player.paused());
    //if (this.player.paused()) this.onStopClick();
  }

  openVideo(url) {
    this.player.src({ type: "video/youtube", src: url });
    this.player.reset();
  }

  componentWillReceiveProps(nextProps) {
    this.applySharedRoomData();
  }

  getCurrentSynchActionHash() {
    const syncAction = this.getCurrentSynchAction();

    return syncAction !== null ? syncAction.hash : "";
  }

  // handles play if all players are ready
  // precondition: player stopped on the corresponding time
  processSyncActionsByClientsState(syncAction) {
    const { mediaAction, time, timestamp, hash, sender } = syncAction;
    if (mediaAction !== "play") return;

    // console.log("PLAYYYYY!????????????!?!?!?!!?");
    // if the media action is "play" and we are
    // not ready to play (readystate < HAVE_METADATA)
    // make sure we begin to play independent of others
    if (this.player.readyState() < 2) {
      this.player.play();
      return;
    }

    const { roomData } = this.props.roomState;
    const clients = roomData.state.sharedRoomData.clients;
    const clientsArray = Object.keys(clients);

    var allClientsReadyToPlay = true;
    // process play action if all clients ready
    for (let i = 0; i < clientsArray.length; i++) {
      const clientId = clientsArray[i];

      // ignore myself
      if (clientId === ownSocketId()) continue;

      const clientData = clients[clientId];

      if ("readyState" in clientData) {
        const { actionHash, playerReadyState } = clientData.readyState;

        // TODO: check ready state meaning

        // console.log("CHECK USER READY", clientId, playerReadyState);

        if (actionHash !== hash || playerReadyState < 3)
          allClientsReadyToPlay = false;
      } else allClientsReadyToPlay = false;
    }

    if (this.player.paused && allClientsReadyToPlay) {
      this.player.play();
      // console.log("PLAYYYYY!");
    } else this.player.pause();
  }

  checkForUpdateRequests(sharedRoomData) {
    if (
      sharedRoomData.updateRequest &&
      sharedRoomData.clients &&
      sharedRoomData.updateRequest !== ownSocketId()
    ) {
      // check if I'm the oldest client
      const clientsArray = Object.keys(sharedRoomData.clients);
      if (clientsArray[0] == ownSocketId()) {
        // repeat last media action
        const { mediaAction } = sharedRoomData.syncAction;
        sendSharedRoomData(this.props.roomId, "updateRequest", null, false);
        this.shareSyncAction(mediaAction, this.player.currentTime());
      }
    }
  }

  // whenever the shared room data changes
  applySharedRoomData() {
    const { roomAvailable, roomData } = this.props.roomState;

    if (!roomAvailable) return;

    if (!this.player) this.tryInitializePlayer("Apply SHared Data");

    // ignore sync actions if the player is not initialized
    if (!this.player || !this.state.initialized) return;

    this.player.ready(() => {
      // check for new synch action
      if ("syncAction" in roomData.state.sharedRoomData) {
        const syncAction = roomData.state.sharedRoomData.syncAction;

        const { mediaAction, time, timestamp, hash, sender } = syncAction;

        // todo: handle media actions in a better place

        this.checkForUpdateRequests(roomData.state.sharedRoomData);
        this.processSyncActionsByClientsState(syncAction);

        // this action has already been processed
        if (this.state.lastProcessedHash === hash) return;

        console.log("media event", mediaAction);

        switch (mediaAction) {
          case "play":
          case "pause":
            this.handleSharedTimeUpdate(syncAction);
            break;
          case "changeVideoUrl":
            this.handleVideoUrlChange(syncAction);
            break;

          default:
            break;
        }

        this.setState({ lastProcessedHash: hash, pendingTimeRequest: false });
      }
    });
  }

  handleVideoUrlChange(syncAction) {
    // this.player.pause();
    // this.reCreatePlayer(syncAction.url);
    var sources = [{ type: "video/youtube", src: syncAction.url }];
    this.player.pause();
    this.player.src(sources);
    this.player.load();
    //this.player.play();
  }

  handleSharedTimeUpdate(syncAction) {
    this.player.pause();
    console.log("SYNc ACTION", syncAction.mediaAction);

    setTimeout(() => {
      this.player.one("timeupdate", e => {
        // since this update is not accurate => add timeout

        setTimeout(() => {
          console.log("DISPATCH REDY STATE");

          //if (syncAction.mediaAction !== "play") this.player.pause();
          // dispatch ready
          this.checkAndUpdateReadyState(syncAction.hash);
        }, 200);
      });
      // TODO: this plays the video sometimes?!
      this.player.currentTime(syncAction.time);
    }, 200);

    //this.player.pause();
  }

  onPlayClick() {
    // console.log("PLAY CLICK", this.props.roomId);
    // sendSharedRoomData(this.props.roomId, "play", true, false);
    this.shareSyncAction("play", this.player.currentTime());
  }

  onStopClick() {
    //this.player.pause();
    // console.log("STOP CLICK", this.props.roomId);
    // sendSharedRoomData(this.props.roomId, "play", false, false);
    this.shareSyncAction("pause", this.player.currentTime());
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

  onPlayPercRequest(reqPerc) {
    const targetTime = this.player.duration() * reqPerc;
    // console.log("TARGETTIME", this.player.duration() * reqPerc);

    this.shareSyncAction("pause", targetTime);
  }

  onScrubbing(perc) {
    const targetTime = this.player.duration() * perc;
    this.player.currentTime(targetTime);
  }

  onScrubStartEnd(scrubbing) {
    const { roomAvailable, roomData } = this.props.roomState;

    if (roomAvailable)
      shareTransientAwareness(
        roomData.state.roomId,
        "scrubbing",
        scrubbing,
        true
      );
  }

  getCurrentSynchAction() {
    const { roomAvailable, roomData } = this.props.roomState;
    if (roomAvailable && "syncAction" in roomData.state.sharedRoomData) {
      return roomData.state.sharedRoomData.syncAction;
    }
    return null;
  }

  renderPlayBackButton() {
    const syncAction = this.getCurrentSynchAction();

    const play = syncAction === null || syncAction.mediaAction !== "play";

    return (
      <button
        type="button"
        className="btn btn-info"
        onClick={
          play ? this.onPlayClick.bind(this) : this.onStopClick.bind(this)
        }
      >
        {play ? "Play" : "Pause"}
      </button>
    );
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    const { currentPlayTime, maxPlayTime } = this.state;
    const targetPerc = maxPlayTime === 0 ? 0 : currentPlayTime / maxPlayTime;

    // check which button to show

    return (
      <div className="video-wrapper">
        <div data-vjs-player>
          Test
          <video
            ref={node => (this.videoNode = node)}
            className="video-js video-container2"
          />
        </div>

        {this.renderPlayBackButton()}

        <PlayBackControls
          currentPercent={targetPerc}
          onPlayPercRequest={this.onPlayPercRequest.bind(this)}
          onScrubbing={this.onScrubbing.bind(this)}
          onBeginScrub={this.onScrubStartEnd.bind(this, true)}
          onEndScrub={this.onScrubStartEnd.bind(this, false)}
          roomState={this.props.roomState}
          processedHash={this.state.lastProcessedHash}
        />
      </div>
    );
  }
}
