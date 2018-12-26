// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

// This library is known as multi-user connectivity wrapper!
// It handles connectivity tasks to make sure two or more users can interconnect!

import {
  sendGenericRoomMessage,
  ownSocketId
} from "../../../socket-handlers/api";
import {
  USER_LEFT_ROOM,
  LEAVE_ROOM,
  ROOM_LEFT,
  GENERIC_ROOM_MESSAGE
} from "../../logic-controls/socketEvents";
import RTCPeerConnection5 from "./RTCPeerConnection-v1.5";

var conference = function(config) {
  var self = {
    userToken: "",
    mediaOutstream: { audio: false, video: false }
  };
  var channels = [];
  var sockets = [];

  function ResetState() {
    self = {
      userToken: "",
      mediaOutstream: { audio: false, video: false }
    };
    channels = [];
    sockets = [];
  }

  function onDefaultSocketResponse(roomId, response) {
    console.log("default socket message received", response);

    if (response.userToken === self.userToken || roomId !== self.roomToken)
      return;

    // a new participant appeared, check type of connection he wants
    if (response.joinUser == "allForced") {
      // allForced: new participant has out stream => initiate p2p connection to him
      console.log("received new participant connection", response.joinUser);
      onNewParticipant(response.userToken);
    } else if (response.joinUser == "allWithValidStream") {
      // allWithValidStream: new participant wants to connect if i have valid media out stream
      // => initiate p2p connection to him
      if (self.mediaOutstream.audio || self.mediaOutstream.video) {
        console.log("received new participant connection", response.joinUser);
        onNewParticipant(response.userToken);
      } else {
        console.log(
          "received new participant ignore user connect request connection",
          response.joinUser
        );
      }
    }
    // participant wants to join me (broadcaster, or new participant (coming from onNewParticipant)), I offer him channel
    else if (
      response.userToken &&
      response.joinUser == self.userToken &&
      response.participant &&
      channels.indexOf(response.userToken) == -1
    ) {
      channels.push(response.userToken);

      openSubSocket({
        isofferer: true,
        channel: response.channel || response.userToken,
        targetClientId: response.userToken
      });
    }

    // to make sure room is unlisted if owner leaves
    if (response.left && config.onRoomClosed) {
      config.onRoomClosed(response);
    }
  }

  function openSubSocket(_config) {
    if (!_config.channel) return;

    var socket,
      isofferer = _config.isofferer,
      gotstream,
      mediaElement /*= document.createElement("video")*/,
      inner = {},
      peer,
      streamEnded;

    var socketConfig = {
      channel: _config.channel,
      onmessage: socketResponse,
      audioVideoConfig: config.audioVideoConfig,
      onopen: function() {
        if (isofferer && !peer) initPeer();
        sockets[sockets.length] = socket;
      }
    };

    socketConfig.callback = function(_socket, otherMediaConfig) {
      socket = _socket;
      socket.targetClientId = _config.targetClientId;
      socket.targetMediaConfig = otherMediaConfig;
      console.log("socket other media", otherMediaConfig);

      socket.on("disconnect", () => {
        console.log("disconnected , clear peer");
        clearPeer(_config.targetClientId);
      });

      this.onopen();

      if (_config.callback) {
        _config.callback();
      }
    };

    config.openSocket(socketConfig);

    var peerConfig = {
      attachStream: config.attachStream,
      onICE: function(candidate) {
        socket.send({
          userToken: self.userToken,
          candidate: {
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: JSON.stringify(candidate.candidate)
          }
        });
      },
      onRemoteStream: function(stream) {
        console.log(
          "I received stream:",
          _config.targetClientId,
          stream,
          socket.targetMediaConfig
        );

        if (!stream) return;

        stream.validTracks = socket.targetMediaConfig;
        _config.stream = stream;

        const isFullDummyStream =
          !socket.targetMediaConfig.audio && !socket.targetMediaConfig.video;

        const audioOnly =
          socket.targetMediaConfig.audio && !socket.targetMediaConfig.video;

        if (isFullDummyStream || audioOnly) {
          mediaElement = document.createElement("audio");
        } else {
          mediaElement = document.createElement("video");
        }

        try {
          mediaElement.setAttributeNode(document.createAttribute("autoplay"));
          mediaElement.setAttributeNode(
            document.createAttribute("playsinline")
          );
          mediaElement.setAttributeNode(document.createAttribute("controls"));
          // mediaElement.setAttributeNode(document.createAttribute("muted"));
        } catch (e) {
          mediaElement.setAttribute("autoplay", true);
          mediaElement.setAttribute("playsinline", true);
          mediaElement.setAttribute("controls", true);
          // mediaElement.setAttribute("muted", true);
        }

        mediaElement.srcObject = stream;

        onRemoteStreamStartsFlowing();
        // afterRemoteStreamStartedFlowing();
      },
      onRemoteStreamEnded: function(stream) {
        streamEnded = true;
        if (config.onRemoteStreamEnded) config.onRemoteStreamEnded(stream);
      }
    };

    function initPeer(offerSDP) {
      if (!offerSDP) {
        peerConfig.onOfferSDP = sendsdp;
      } else {
        peerConfig.offerSDP = offerSDP;
        peerConfig.onAnswerSDP = sendsdp;
      }

      peerConfig.mediaConfig = self.mediaOutstream;
      peerConfig.otherMediaConfig = socket.targetMediaConfig;

      // peer = window.RTCPeerConnection5(peerConfig);
      peer = RTCPeerConnection5(peerConfig);
      console.log("init peer", peer);

      socket.peer = peer; // mh
    }

    function afterRemoteStreamStartedFlowing() {
      gotstream = true;
      mediaElement = null;

      if (config.onRemoteStream) {
        console.log(
          "got remote stream:",
          _config.targetClientId,
          socket.channel,
          _config,
          channels
        );

        config.onRemoteStream({
          stream: _config.stream,
          clientId: _config.targetClientId
        });
      }
    }

    function onRemoteStreamStartsFlowing() {
      if (
        navigator.userAgent.match(
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i
        )
      ) {
        // if mobile device
        return afterRemoteStreamStartedFlowing();
      }

      console.log(
        "onRemoteStreamStartsFlowing",
        mediaElement.readyState,
        mediaElement.paused,
        mediaElement.currentTime
      );

      const validTracks = _config.stream.validTracks;
      const isFullDummyStream = !validTracks.audio && !validTracks.video;

      console.log("is full dummy stream", isFullDummyStream, validTracks);

      if (
        !(
          mediaElement.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA ||
          mediaElement.paused ||
          mediaElement.currentTime <= 0
        )
      ) {
        afterRemoteStreamStartedFlowing();
      } else if (!streamEnded) {
        setTimeout(onRemoteStreamStartsFlowing, 50);
      } else if (streamEnded) {
        // something wrong with connection. retry
      }
    }

    function sendsdp(sdp) {
      socket.send({
        userToken: self.userToken,
        sdp: JSON.stringify(sdp)
      });
    }

    function socketResponse(response) {
      if (response.userToken == self.userToken) return;
      if (response.sdp) {
        inner.sdp = JSON.parse(response.sdp);
        selfInvoker();
      }

      if (response.candidate && !gotstream) {
        if (!peer) console.error("missed an ice", response.candidate);
        else
          peer.addICE({
            sdpMLineIndex: response.candidate.sdpMLineIndex,
            candidate: JSON.parse(response.candidate.candidate)
          });
      }

      if (response.left) {
        if (peer && peer.peer) {
          clearPeer(_config.targetClientId);

          peer.peer.close();
          peer.peer = null;
        }
      }
    }

    var invokedOnce = false;

    function selfInvoker() {
      console.log("INVOKED?", invokedOnce);
      if (invokedOnce) return;

      invokedOnce = true;

      if (isofferer) peer.addAnswerSDP(inner.sdp);
      else initPeer(inner.sdp);
    }
  }

  function clearPeer(clientId) {
    const idx = channels.indexOf(clientId);
    if (idx !== -1) channels.splice(idx, 1);

    console.log("channels after clear peer", channels);

    var length = sockets.length;
    for (var i = 0; i < length; i++) {
      var socket = sockets[i];
      console.log("iterate socket", i, socket, length);
      if (socket && socket.targetClientId === clientId) {
        console.log("found socket => remove", socket);

        if (socket.peer && socket.peer.peer) {
          socket.peer.peer.close();
          socket.peer = null;
        }
        socket.disconnect();
        delete sockets[i];
      }
    }

    console.log("peer left!", clientId, channels, sockets);
  }

  function getOwnMediaConfig() {
    return self.mediaOutstream;
  }

  function leave(streamRoomAlreadyLeft) {
    if (!self.roomToken) return;

    removeInRoomListeners();

    if (!streamRoomAlreadyLeft)
      window.socketEvents.dispatch(LEAVE_ROOM, self.roomToken);

    var length = sockets.length;
    for (var i = 0; i < length; i++) {
      var socket = sockets[i];
      if (socket) {
        if (socket.peer && socket.peer.peer) socket.peer.peer.close();
        socket.send({
          left: true,
          userToken: self.userToken
        });
        socket.disconnect();
        delete sockets[i];
      }
    }

    if (config.attachStream) {
      if ("stop" in config.attachStream) {
        config.attachStream.stop();
      } else {
        config.attachStream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    }

    ResetState();

    if (config.onRoomLeft) config.onRoomLeft();
  }

  window.addEventListener(
    "beforeunload",
    function() {
      leave();
    },
    false
  );

  window.addEventListener(
    "keyup",
    function(e) {
      if (e.keyCode == 116) leave();
    },
    false
  );

  function onNewParticipant(channel) {
    if (
      !channel ||
      channels.indexOf(channel) != -1 ||
      channel == self.userToken
    )
      return;
    // channels += channel + "--";
    channels.push(channel);

    var new_channel = uniqueToken();
    openSubSocket({
      channel: new_channel,
      targetClientId: channel
    });

    console.log("my current channels", channels);

    console.log("received new participant, send default", {
      participant: true,
      userToken: self.userToken,
      joinUser: channel,
      channel: new_channel
    });

    sendDefaultRoomMessage({
      participant: true,
      userToken: self.userToken,
      joinUser: channel,
      channel: new_channel
    });
  }

  function uniqueToken() {
    var s4 = function() {
      return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  function onUserLeftRoom(roomId, userId) {
    console.log("user left room", userId, roomId);

    if (roomId === self.roomToken) clearPeer(userId);
  }

  function onRoomLeft(roomId) {
    console.log("I left room", roomId);

    if (roomId === self.roomToken) leave(true);
  }

  function addInRoomListeners() {
    // removeInRoomListeners();
    console.log("add room listeners");
    window.socketEvents.add(USER_LEFT_ROOM, onUserLeftRoom);
    window.socketEvents.add(ROOM_LEFT, onRoomLeft);
    window.socketEvents.add(GENERIC_ROOM_MESSAGE, onDefaultSocketResponse);
  }

  function removeInRoomListeners() {
    console.log("remove room listeners");

    window.socketEvents.remove(USER_LEFT_ROOM, onUserLeftRoom);
    window.socketEvents.remove(ROOM_LEFT, onRoomLeft);
    window.socketEvents.remove(GENERIC_ROOM_MESSAGE, onDefaultSocketResponse);
  }

  // openDefaultSocket(config.onReady || function() {});
  function sendDefaultRoomMessage(message) {
    console.log("send message", self.roomToken, message);

    sendGenericRoomMessage(self.roomToken, message);
  }

  return {
    joinRoom: function(_config) {
      console.log("JOINING CONF");

      self.roomToken = _config.parentRoomId + "_stream";
      self.parentRoom = _config.parentRoomId;
      self.userToken = ownSocketId();
      self.mediaOutstream = _config.mediaConfig;

      addInRoomListeners();

      console.log("selfdata", self);

      var connectWith;
      // check type of connection we want
      if (self.mediaOutstream.audio || self.mediaOutstream.video) {
        // i have stream output, force others to connect to me
        connectWith = "allForced";
      } else {
        // i dont have out data, connect to me only if other have data
        connectWith = "allWithValidStream";
      }

      sendDefaultRoomMessage({
        participant: true,
        userToken: self.userToken,
        joinUser: connectWith
      });
    },
    leaveRoom: leave,
    getActiveMediaConfig: getOwnMediaConfig
  };
};

export default conference;
