// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

// This library is known as multi-user connectivity wrapper!
// It handles connectivity tasks to make sure two or more users can interconnect!

import {
  sendGenericRoomMessage,
  sendSharedRoomData,
  ownSocketId
} from "../../../socket-handlers/api";
import {
  USER_LEFT_ROOM,
  LEAVE_ROOM,
  ROOM_LEFT
} from "../../logic-controls/socketEvents";
import store from "../../../store";

var conference = function(config) {
  var self = {
    userToken: ""
  };
  var channels = "--",
    isbroadcaster;
  var isGetNewRoom = true;
  var sockets = [];
  var defaultSocket = {};

  function ResetState() {
    self = {
      userToken: ""
    };
    channels = "--";
    isbroadcaster = false;
    isGetNewRoom = true;
    sockets = [];
    defaultSocket = {};
  }

  function openDefaultSocket(callback) {
    defaultSocket = config.openSocket({
      onmessage: onDefaultSocketResponse,
      callback: function(socket) {
        defaultSocket = socket;
        callback();
      }
    });
  }

  function onDefaultSocketResponse(response) {
    if (response.userToken == self.userToken) return;

    // not joined yet, message by broadcaster => done, now send via shared room data
    // if (isGetNewRoom && response.roomToken && response.broadcaster)
    //   config.onRoomFound(response);

    // sent by broadcaster, I'm joiner (self.broadcasterid is set) and will call onNewParticipant

    console.log(
      "received new participant?, send default",
      response.newParticipant,
      self.joinedARoom,
      self.broadcasterClientid == response.userToken,
      response.userToken
    );
    if (
      response.newParticipant &&
      self.joinedARoom &&
      self.broadcasterClientid == response.userToken
    ) {
      console.log("received new participant");
      // I am old participant, broadcaster sent me new participant
      // => open subsocket and send this participant with to offer
      onNewParticipant(response.newParticipant);
    }

    // participant wants to join me (broadcaster, or participant (coming from onNewParticipant)), I offer him channel
    if (
      response.userToken &&
      response.joinUser == self.userToken &&
      response.participant &&
      channels.indexOf(response.userToken) == -1
    ) {
      channels += response.userToken + "--";

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
    var socketConfig = {
      channel: _config.channel,
      onmessage: socketResponse,
      onopen: function() {
        if (isofferer && !peer) initPeer();
        sockets[sockets.length] = socket;
      }
    };

    socketConfig.callback = function(_socket) {
      socket = _socket;
      this.onopen();

      if (_config.callback) {
        _config.callback();
      }
    };

    var socket = config.openSocket(socketConfig),
      isofferer = _config.isofferer,
      gotstream,
      video = document.createElement("video"),
      inner = {},
      peer;

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
        if (!stream) return;

        try {
          video.setAttributeNode(document.createAttribute("autoplay"));
          video.setAttributeNode(document.createAttribute("playsinline"));
          video.setAttributeNode(document.createAttribute("controls"));
        } catch (e) {
          video.setAttribute("autoplay", true);
          video.setAttribute("playsinline", true);
          video.setAttribute("controls", true);
        }

        video.srcObject = stream;

        _config.stream = stream;

        console.log("I recaived stream:", _config.targetClientId, stream);

        onRemoteStreamStartsFlowing();
      },
      onRemoteStreamEnded: function(stream) {
        if (config.onRemoteStreamEnded)
          config.onRemoteStreamEnded(stream, video);
      }
    };

    function initPeer(offerSDP) {
      if (!offerSDP) {
        peerConfig.onOfferSDP = sendsdp;
      } else {
        peerConfig.offerSDP = offerSDP;
        peerConfig.onAnswerSDP = sendsdp;
      }

      peer = window.RTCPeerConnection5(peerConfig);
    }

    function afterRemoteStreamStartedFlowing() {
      gotstream = true;

      if (config.onRemoteStream) {
        console.log(
          "got remote stream:",
          _config.targetClientId,
          socket.channel,
          _config,
          channels
        );

        config.onRemoteStream({
          video: video,
          stream: _config.stream,
          clientId: _config.targetClientId
        });
      }

      console.log("got stream", channels, channels.split("--").length);
      if (isbroadcaster && channels.split("--").length > 3) {
        /* broadcasting newly connected participant for video-conferencing! */
        defaultSocket.send({
          newParticipant: socket.channel,
          userToken: self.userToken
        });

        console.log("send new participant", {
          newParticipant: socket.channel,
          userToken: self.userToken
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

      if (
        !(
          video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA ||
          video.paused ||
          video.currentTime <= 0
        )
      ) {
        afterRemoteStreamStartedFlowing();
      } else setTimeout(onRemoteStreamStartsFlowing, 50);
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
          peer.peer.close();
          peer.peer = null;
        }
      }
    }

    var invokedOnce = false;

    function selfInvoker() {
      if (invokedOnce) return;

      invokedOnce = true;

      if (isofferer) peer.addAnswerSDP(inner.sdp);
      else initPeer(inner.sdp);
    }
  }

  function leave(streamRoomAlreadyLeft) {
    removeInRoomListeners();

    if (!streamRoomAlreadyLeft)
      window.socketEvents.dispatch(LEAVE_ROOM, self.roomToken);

    var length = sockets.length;
    for (var i = 0; i < length; i++) {
      var socket = sockets[i];
      if (socket) {
        socket.send({
          left: true,
          userToken: self.userToken
        });
        delete sockets[i];
      }
    }

    // if owner leaves; try to remove his room from all other users side
    // if (isbroadcaster) {
    //   defaultSocket.send({
    //     left: true,
    //     userToken: self.userToken,
    //     roomToken: self.roomToken
    //   });
    // }

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

  function startBroadcasting() {
    // defaultSocket &&
    //   defaultSocket.send({
    //     roomToken: self.roomToken,
    //     roomName: self.roomName,
    //     broadcaster: self.userToken
    //   });
    // setTimeout(startBroadcasting, 3000);

    sendSharedRoomData(self.parentRoom, "streamRoomData", {
      broadcasterClientId: self.userToken
    });
  }

  function onNewParticipant(channel) {
    if (
      !channel ||
      channels.indexOf(channel) != -1 ||
      channel == self.userToken
    )
      return;
    channels += channel + "--";

    var new_channel = uniqueToken();
    openSubSocket({
      channel: new_channel,
      targetClientId: channel
    });

    console.log("received new participant, send default", {
      participant: true,
      userToken: self.userToken,
      joinUser: channel,
      channel: new_channel
    });

    defaultSocket.send({
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

  function onUserLeftRoom(roomId, userId, firstClientIdInRoom) {
    if (
      roomId === "WebRtcTestRoom_stream" &&
      self.joinedARoom &&
      self.broadcasterClientid === userId
    ) {
      // broadcaster left the room, check if I am the new broadcaster
      var iAmBroadcaster = firstClientIdInRoom === self.userToken;

      console.log("I am new broadcaster", iAmBroadcaster, firstClientIdInRoom);
      if (iAmBroadcaster) {
        delete self["joinedARoom"];
        delete self["broadcasterClientid"];
        isbroadcaster = true;
        startBroadcasting();
      }
    }
  }

  function onRoomLeft(roomId) {
    if (roomId === self.roomToken) leave();
  }

  function addInRoomListeners() {
    removeInRoomListeners();
    window.socketEvents.add(USER_LEFT_ROOM, onUserLeftRoom);
    window.socketEvents.add(ROOM_LEFT, onRoomLeft);
  }

  function removeInRoomListeners() {
    window.socketEvents.remove(USER_LEFT_ROOM, onUserLeftRoom);
    window.socketEvents.remove(ROOM_LEFT, onRoomLeft);
  }

  openDefaultSocket(config.onReady || function() {});

  return {
    createRoom: function(_config) {
      // self.roomName = _config.roomName || "Anonymous";
      self.roomToken = _config.parentRoomId + "_stream";
      self.parentRoom = _config.parentRoomId;
      self.userToken = ownSocketId();

      isbroadcaster = true;
      isGetNewRoom = false;
      addInRoomListeners();
      startBroadcasting();
    },
    joinRoom: function(_config) {
      self.roomToken = _config.parentRoomId + "_stream";
      self.parentRoom = _config.parentRoomId;
      self.userToken = ownSocketId();

      isGetNewRoom = false;

      self.joinedARoom = true;
      // self.broadcasterid = _config.joinUser;
      self.broadcasterClientid = _config.joinUserClientId;

      console.log("selfdata", self);

      // I join, channel my id, join user: broadcaster
      openSubSocket({
        channel: self.userToken,
        targetClientId: _config.joinUserClientId,
        callback: function() {
          defaultSocket.send({
            participant: true,
            userToken: self.userToken,
            joinUser: _config.joinUserClientId
          });
        }
      });

      addInRoomListeners();
    },
    leaveRoom: leave
  };
};

export default conference;
