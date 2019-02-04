import React, { Component } from "react";
import { connect } from "react-redux";
import "./VideoCanvas.css";
import {
  shareTransientAwareness,
  sendDraw,
  registerTo,
  unregisterFrom,
  ownSocketId
} from "../../../socket-handlers/api";
import classnames from "classnames";

import { TIME_UPDATE } from "../AbstractVideoEvents";
import { PAUSE_REQUEST } from "../../video-session/PlayBackUiEvents";
import { FEATURES } from "../../../reducers/featureTypes";
import connectUIState from "../../../highOrderComponents/UIStateConsumer";

// percent of background stroke shade
const secondaryColorShade = 0.4;

class VideoCanvas extends Component {
  constructor(props) {
    super(props);

    this.colorShadeCache = {};

    this.state = {
      color: "blue",
      drawing: false,
      isCleared: true,
      shareDraw: true
    };

    this.pos = {};

    this.offsetRect = { x: 0, y: 0 };

    this.canvasRef = React.createRef();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.throttle = this.throttle.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onDrawingEvent = this.onDrawingEvent.bind(this);
    this.onPlayerTimeUpdate = this.onPlayerTimeUpdate.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const socketId = ownSocketId();

    const nextState = { ...this.state };

    nextState.shareDraw = newProps.localState.syncState.sync;

    if (
      socketId in
      newProps.rooms.rooms[this.props.roomId].state.sharedRoomData.clients
    ) {
      const userColor =
        newProps.rooms.rooms[this.props.roomId].state.sharedRoomData.clients[
          socketId
        ].color;
      nextState.color = userColor;
    }

    if (
      this.props.isVideoVisible != newProps.isVideoVisible &&
      newProps.isVideoVisible
    )
      this.onResize();

    this.setState(nextState);
  }

  componentDidMount() {
    this.props.sessionEvents.add(TIME_UPDATE, this.onPlayerTimeUpdate);
    const canvasElement = this.canvasRef.current;
    this.canvasContext = canvasElement.getContext("2d");
    canvasElement.addEventListener("mousedown", this.onMouseDown, false);
    canvasElement.addEventListener("mouseup", this.onMouseUp, false);
    canvasElement.addEventListener("mouseout", this.onMouseUp, false);
    canvasElement.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 10),
      false
    );

    registerTo("draw", this.onDrawingEvent);
    window.addEventListener("resize", this.onResize, false);

    this.onResize();
  }

  componentWillUnmount() {
    this.props.sessionEvents.remove(TIME_UPDATE, this.onPlayerTimeUpdate);
    const canvasElement = this.canvasRef.current;
    canvasElement.removeEventListener("mousedown", this.onMouseDown);
    canvasElement.removeEventListener("mouseup", this.onMouseUp);
    canvasElement.removeEventListener("mouseout", this.onMouseUp);
    canvasElement.removeEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 10)
    );
    window.removeEventListener("resize", this.onResize);
    unregisterFrom("draw", this.onDrawingEvent);

    if (this.resizeTimer) clearTimeout(this.resizeTimer);
  }

  onPlayerTimeUpdate() {
    if (!this.state.isCleared) {
      this.clearCanvas();
    }
  }

  onMouseDown(e) {
    if (!this.props.playerRef.isPaused())
      window.sessionEvents.dispatch(PAUSE_REQUEST);

    this.setState({ drawing: true });
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
    shareTransientAwareness(this.props.roomId, "drawing", true, true);
  }

  onMouseUp(e) {
    if (!this.state.drawing) {
      return;
    }
    this.setState({ drawing: false });
    this.drawLine(
      this.pos.x,
      this.pos.y,
      e.clientX,
      e.clientY,
      this.state.color,
      true
    );
    shareTransientAwareness(this.props.roomId, "drawing", false, true);
  }

  onMouseMove(e) {
    if (!this.state.drawing) {
      return;
    }
    this.drawLine(
      this.pos.x,
      this.pos.y,
      e.clientX,
      e.clientY,
      this.state.color,
      true
    );
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
  }

  drawLine(x0, y0, x1, y1, color, isLocal) {
    if (this.state.isCleared) {
      this.setState({ isCleared: false });
    }

    if (isLocal) {
      x0 -= this.offsetRect.left;
      y0 -= this.offsetRect.top;

      x1 -= this.offsetRect.left;
      y1 -= this.offsetRect.top;
    }

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x0, y0);
    this.canvasContext.lineTo(x1, y1);

    var secondaryColor = this.shadeColor(color);

    this.canvasContext.strokeStyle = secondaryColor;
    this.canvasContext.lineWidth = 6;
    this.canvasContext.stroke();

    this.canvasContext.strokeStyle = color;
    this.canvasContext.lineWidth = 2;
    this.canvasContext.stroke();
    this.canvasContext.closePath();

    if (!isLocal) {
      return;
    }

    const w = this.canvasRef.current.width;
    const h = this.canvasRef.current.height;

    if (this.state.shareDraw)
      sendDraw(this.props.roomId, x0 / w, y0 / h, x1 / w, y1 / h, color);
  }

  clearCanvas() {
    if (!this.state.isCleared) {
      this.canvasContext.clearRect(
        0,
        0,
        this.canvasRef.current.width,
        this.canvasRef.current.height
      );
      this.setState({ isCleared: true });
    }
  }

  onDrawingEvent(x0, y0, x1, y1, color) {
    // TODO: prevent this on senders/server side
    if (!this.state.shareDraw) return;

    const w = this.canvasRef.current.width;
    const h = this.canvasRef.current.height;
    this.drawLine(x0 * w, y0 * h, x1 * w, y1 * h, color, false);
  }

  // limit the number of events per second
  throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  // make the canvas fill its parent
  onResize() {
    this.resizeTimer = setTimeout(() => {
      const canvas = this.canvasRef.current;
      const parent = canvas.parentElement;

      if (
        canvas.width !== parent.clientWidth ||
        canvas.height !== parent.clientHeight
      ) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      this.offsetRect = canvas.getBoundingClientRect();
    }, 1500);
  }

  shadeColor(color) {
    if (this.colorShadeCache[color]) return this.colorShadeCache[color];

    const percent = secondaryColorShade;
    var f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;

    const hexShade =
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1);
    this.colorShadeCache[color] = hexShade;
    return hexShade;
  }

  render() {
    // TODO: FeatureConsumer
    const canvasEnabled =
      this.props.isMarkerActive &&
      !(FEATURES.MARKERS in this.props.restrictions.disabledFeatures);

    return (
      <canvas
        ref={this.canvasRef}
        id="VideoCanvas"
        className={classnames("", {
          "videocanvas-marker-transient":
            this.props.settings.markerType === "marker-transient" &&
            canvasEnabled,
          "videocanvas-marker-none":
            this.props.settings.markerType === "marker-none" || !canvasEnabled
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
  settings: state.settings,
  localState: state.localState,
  restrictions: state.restrictions
});

export default connect(
  mapStateToProps,
  null
)(connectUIState(VideoCanvas));
