import React, { Component } from "react";
import Observable from "../../utils/observable";
import {
  READY,
  STALLED,
  TIME_UPDATE,
  PLAYING,
  PAUSED,
  PLAY_CHANGE,
  PLAYER_API_INITIALIZED,
  VOLUME_CHANGE
} from "../video-session/AbstractVideoEvents";
import Contain from "react-contain";

import VideoPlyrYouTube from "./VideoPlyr/VideoPlyrYouTube";
import VideoPlyrHTML5 from "./VideoPlyr/VideoPlyrHTML5";

// component that abstract from player technology
export default class AbstractVideo extends Component {
  constructor(props) {
    super(props);

    this.playerRef = React.createRef();
    this.observable = new Observable(props.sessionEvents);

    this.state = {
      videoUrl: "",
      scrubMode: false
    };

    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onPlaying = this.onPlaying.bind(this);
    this.onPaused = this.onPaused.bind(this);
    this.onPlayerApiInitialized = this.onPlayerApiInitialized.bind(this);
    this.onReadyToPlayChanged = this.onReadyToPlayChanged.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  fixTime(time) {
    this.playerRef.current.fixTime(time);
  }

  scrubMode(scrubbing) {
    this.setState({ scrubMode: scrubbing });
  }

  isScrubbing() {
    return this.state.scrubMode;
  }

  isPlayerApiInitialized() {
    return (
      this.playerRef.current && this.playerRef.current.isPlayerApiInitialized()
    );
  }

  isReadyToPlay() {
    return this.playerRef.current && this.playerRef.current.isReadyToPlay();
  }

  isStalled() {
    return !this.playerRef.current || !this.playerRef.current.isReadyToPlay();
  }

  getDuration() {
    return this.playerRef.current.getDuration();
  }

  getCurrentTime() {
    if (!this.playerRef.current) return 0;

    return this.playerRef.current.getCurrentTime();
  }

  playCurrent() {
    this.playerRef.current.playCurrent();
  }

  play(time) {
    this.playerRef.current.play(time);
  }

  pause(time, cb) {
    this.playerRef.current.pause(time, cb);
  }

  seek(time) {
    this.playerRef.current.seek(time);
  }

  pauseCurrent() {
    this.playerRef.current.pauseCurrent();
  }

  setVideoUrl(url) {
    this.setState({ videoUrl: url });
  }

  on(event, listener) {
    this.observable.add(event, listener);
  }

  once(event, listener) {
    this.observable.addOnce(event, listener);
  }

  off(event, listener) {
    this.observable.remove(event, listener);
  }

  isPaused() {
    return this.playerRef.current.isPaused();
  }

  isPlaying() {
    return this.playerRef.current.isPlaying();
  }

  getMediaAction() {
    return this.isPlaying() ? "play" : "pause";
  }

  // 0 - 1
  setVolume(perc) {
    this.playerRef.current.setVolume(perc);
  }

  getVolume() {
    return this.playerRef.current.getVolume();
  }

  onPlayerApiInitialized() {
    this.observable.dispatch(PLAYER_API_INITIALIZED);
  }

  onVolumeChange() {
    this.observable.dispatch(VOLUME_CHANGE);
  }

  onTimeUpdate(time) {
    const duration = this.playerRef.current.getDuration();
    this.observable.dispatch(
      TIME_UPDATE,
      time,
      duration !== 0 ? time / duration : 0
    );
  }

  onPlaying() {
    this.observable.dispatch(PLAYING);
    this.observable.dispatch(PLAY_CHANGE, true);
  }

  onPaused() {
    this.observable.dispatch(PAUSED);
    this.observable.dispatch(PLAY_CHANGE, false);
  }

  onReadyToPlayChanged(ready) {
    if (ready) {
      this.observable.dispatch(READY);
    } else {
      this.observable.dispatch(STALLED);
    }
  }

  getTargetVideoComponentByVideoUrl() {
    if (this.state.videoUrl.includes(".mp4")) {
      return VideoPlyrHTML5;
    }

    return VideoPlyrYouTube;
  }

  render() {
    const VideoOverlayComponent = this.props.overlayComponent;

    // video component can be VideoPlyr or VideoPlayer (VideoJs)
    const VideoComponent = this.getTargetVideoComponentByVideoUrl();
    const validUrlContent = (
      <VideoComponent
        ref={this.playerRef}
        videoUrl={this.state.videoUrl}
        onTimeUpdate={this.onTimeUpdate}
        onPlaying={this.onPlaying}
        onPaused={this.onPaused}
        onPlayerApiInitialized={this.onPlayerApiInitialized}
        onReadyToPlayChanged={this.onReadyToPlayChanged}
        onVolumeChange={this.onVolumeChange}
        {...this.props}
      />
    );

    const invalidUrlContent = (
      <div>
        <h1>Waiting for Url...</h1>
      </div>
    );

    const isInValidVideo = this.state.videoUrl === "";

    return (
      <div className="ContainParent">
        <Contain ratio={1.78} style={{ height: "100%" }}>
          <div id="VideoWrapper">
            <div id="InnerVideoWrapper">
              {isInValidVideo ? invalidUrlContent : validUrlContent}
              {isInValidVideo || !VideoOverlayComponent ? null : (
                <VideoOverlayComponent {...this.props} playerRef={this} />
              )}
            </div>
          </div>
        </Contain>
      </div>
    );
  }
}
