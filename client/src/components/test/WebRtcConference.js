// import io from "socket.io-client";
// import "./WebRTCReq/conference";
import getUserMedia from "getusermedia";
import conference from "./WebRTCReq/conferenceNoBroadcast";
import {
  connectToP2PSignaler,
  connectToP2PChannel,
  ownSocketId
} from "../../socket-handlers/api";
import {
  ROOM_LEFT,
  JOIN_ROOM,
  ROOM_JOINED
} from "../logic-controls/socketEvents";
import { registerStream } from "../../stream-model/StreamModel";
import { OWN_ACTIVE_MEDIA_CHANGED } from "../../stream-model/streamEvents";
import { LOG_ERROR, LOG } from "../logic-controls/logEvents";

export var availableRoom;
var mainSignalSocket;
var conferenceJoined = false;
var conferenceSessionId = "";
var conferenceSessionParentId = "";

var config = {
  openSocket: function(config) {
    // var SIGNALING_SERVER = "https://socketio-over-nodejs2.herokuapp.com:443/";
    var defaultChannel = "defaultChannel";

    var channel = config.channel || defaultChannel;

    // console.log("signal server", SIGNALING_SERVER);

    // mainSignalSocket = window.io.connect(SIGNALING_SERVER).emit("new-channel", {
    //   channel: channel,
    //   sender: sender
    // });

    mainSignalSocket = connectToP2PSignaler().emit("new-channel", {
      channel: channel
    });

    // console.log("channel server", SIGNALING_SERVER + "/" + channel);

    // setTimeout(() => {
    console.log("try connect channel", channel, config.audioVideoConfig);
    const { audio, video } = config.audioVideoConfig;
    var socket = connectToP2PChannel(channel, audio, video);
    // old
    // var socket = window.io.connect(SIGNALING_SERVER + channel);
    socket.channel = channel;

    socket.on("connect_failed", function() {
      console.log(
        "Sorry, there seems to be an issue with the connection!",
        "connect_failed"
      );
    });

    socket.on("error", function(err) {
      console.log(
        "Sorry, there seems to be an issue with the connection!",
        "error",
        err
      );

      setTimeout(() => {
        console.log("try connect channel", channel);
        socket.connect();
      }, 500);
    });

    socket.on("connect_timeout", function() {
      console.log(
        "Sorry, there seems to be an issue with the connection!",
        "connect_timeout"
      );
    });

    socket.on("connect", function() {
      console.log(
        "connected to socket signaling server",
        socket.channel,
        config,
        socket
      );
    });

    // mediaConfigOfBoth clients (socketId => {audio, video})
    socket.on("both-connected", mediaConfigs => {
      var otherMediaConfig;
      const mediaConfigSocketIds = Object.keys(mediaConfigs);
      mediaConfigSocketIds.forEach(socketId => {
        console.log(
          "both-connected",
          socketId,
          socket.id,
          socketId !== socket.id,
          mediaConfigs[socketId]
        );

        if (socketId !== socket.id) otherMediaConfig = mediaConfigs[socketId];
      });

      otherMediaConfig.audio = otherMediaConfig.audio == "true";
      otherMediaConfig.video = otherMediaConfig.video == "true";

      // console.log(
      //   "both connected, others media config received",
      //   otherMediaConfig
      // );
      if (config.callback) config.callback(socket, otherMediaConfig);
    });

    socket.on("disconnect", function() {
      console.log("disconnected from socket channel", socket.channel);
    });

    socket.send = function(message) {
      socket.emit("message", {
        data: message
      });
    };

    socket.on("message", config.onmessage);
    // }, 1000);
  },
  onRemoteStream: function(media) {
    console.log("Remote stream", conferenceSessionId, media);
    registerStream(conferenceSessionId, media.clientId, media.stream);

    // window.p2pEvents.dispatch("remotestream", media.stream, media.clientId);
  },
  onRemoteStreamEnded: function(stream, iceState) {
    console.log("Stream ended", stream);

    if (iceState) {
      window.logEvents.dispatch(LOG, {
        message: iceState
      });
    }
  },
  onRoomFound: function(room) {
    if (availableRoom) return;
    console.log("Room found", room);
    availableRoom = room;
  },
  onRoomClosed(response) {
    console.log(response.userToken);
    // closed by owner
  },
  onRoomLeft() {
    if (mainSignalSocket) {
      mainSignalSocket.disconnect();
      mainSignalSocket = null;
    }
    availableRoom = null;
    console.log("STREAM ROOM CLEARED");
  }
};

export function captureUserMedia(
  video,
  audio,
  success_callback,
  failure_callback
) {
  if (config.attachStream) {
    if ("stop" in config.attachStream) {
      config.attachStream.stop();
    } else {
      config.attachStream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }

  navigator.mediaDevices
    .enumerateDevices()
    .then(function(devices) {
      var hasAudio = false;
      var hasVideo = false;
      devices.forEach(function(device) {
        console.log(
          device.kind + ": " + device.label + " id = " + device.deviceId
        );

        if (device.kind === "audioinput") hasAudio = true;
        else if (device.kind === "videoinput") hasVideo = true;
      });

      const finalAudioVideoConfig = {
        video: video && hasVideo,
        audio: audio && hasAudio
      };

      // getUserMediaWithDummies(finalAudioVideoConfig, (err, stream) => {
      getUserMedia(finalAudioVideoConfig, (err, stream) => {
        if (err) {
          failure_callback(err);
          return console.error(err);
        }

        stream.validTracks = finalAudioVideoConfig;
        config.attachStream = stream;
        config.audioVideoConfig = finalAudioVideoConfig;
        success_callback(stream, finalAudioVideoConfig);
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
      failure_callback(err);
      // getUserMedia({ video: true, audio: true }, (err, stream) => {
      //   if (err) return console.error(err);
      //   config.attachStream = stream;
      //   success_callback(stream);
      // });
    });
}

const silence = () => {
  let ctx = new AudioContext(),
    oscillator = ctx.createOscillator();
  let dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
};

var canvas;
const black = ({ width = 640, height = 480 } = {}) => {
  canvas = Object.assign(document.createElement("canvas"), {
    width,
    height
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);
  let stream = canvas.captureStream();
  return Object.assign(stream.getVideoTracks()[0], { enabled: false });
};

const blackSilence = (...args) => new MediaStream([black(...args), silence()]);

// always returns a stream with video and audio track
// inactive user tracks will be replaced with corresponding dummies
function getUserMediaWithDummies(streamConfig, callback) {
  if (!streamConfig.video && !streamConfig.audio) {
    // both disabled => dummy stream
    callback(null, blackSilence());
    return;
  }

  getUserMedia(streamConfig, (err, stream) => {
    if (err) return console.error(err);
    if (!streamConfig.video) stream.addTrack(black());
    if (!streamConfig.audio) stream.addTrack(silence());

    callback(err, stream);
  });
}

window.socketEvents.add(ROOM_LEFT, roomId => {
  if (roomId === conferenceSessionId) {
    conferenceJoined = false;
    onLeft();
  } else if (roomId === conferenceSessionParentId) leaveConference();
});

var conferenceUI = conference(config);

// for joining and rejoining
export function joinConference(parentRoom, video, audio) {
  if (conferenceJoined) {
    // first logout of conference
    window.socketEvents.addOnce(ROOM_LEFT, roomId => {
      if (roomId === conferenceSessionId) {
        conferenceJoined = false;
        joinConference(parentRoom, video, audio);
      }
    });
    conferenceUI.leaveRoom();
    return;
  }

  if (!video && !audio) {
    config.attachStream = null;
    config.audioVideoConfig = { audio: false, video: false };
    connectToStreamRoomAfterMediaSetup(
      { video: false, audio: false },
      parentRoom
    );
  } else {
    captureUserMedia(
      video,
      audio,
      (stream, finalMediaConfig) => {
        registerStream(parentRoom + "_stream", ownSocketId(), stream);
        connectToStreamRoomAfterMediaSetup(finalMediaConfig, parentRoom);
      },
      err => {
        console.error("Join Confi", err);
        connectToStreamRoomAfterMediaSetup(
          { video: false, audio: false },
          parentRoom
        );
        window.logEvents.dispatch(LOG_ERROR, {
          message: `${err.name} - ${err.message}`
        });
        return;
      }
    );
  }
}

function connectToStreamRoomAfterMediaSetup(finalMediaConfig, parentRoom) {
  window.socketEvents.addOnce(ROOM_JOINED, roomId => {
    if (roomId === parentRoom + "_stream") {
      conferenceUI.joinRoom({
        parentRoomId: parentRoom,
        mediaConfig: finalMediaConfig
      });

      onJoinSuccess(parentRoom);
    }
  });
  window.socketEvents.dispatch(JOIN_ROOM, parentRoom + "_stream");
}

function onJoinSuccess(parentRoom) {
  conferenceSessionId = parentRoom + "_stream";
  conferenceSessionParentId = parentRoom;
  conferenceJoined = true;

  window.streamEvents.dispatch(
    OWN_ACTIVE_MEDIA_CHANGED,
    conferenceSessionId,
    conferenceSessionParentId,
    getActiveMediaConfig()
  );
}

function onLeft() {
  window.streamEvents.dispatch(
    OWN_ACTIVE_MEDIA_CHANGED,
    conferenceSessionId,
    conferenceSessionParentId,
    getActiveMediaConfig()
  );
}

export function leaveConference() {
  if (conferenceJoined) {
    console.log("leave confi", conferenceSessionId, conferenceSessionParentId);

    conferenceUI.leaveRoom();
    conferenceJoined = false;
    onLeft();
  }
}

export function getActiveMediaConfig() {
  return conferenceUI.getActiveMediaConfig();
}
