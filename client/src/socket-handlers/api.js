import openSocket from "socket.io-client";
import { PEER_SIGNAL_MESSAGE } from "../p2p-handlers/p2pEvents";
var socket = null;
var lastToken = "";

const isSecure = window.location.protocol === "https:";

// TODO: ssl set openSocket secure: true
const getHost = (path, token, params = "") => {
  var port = 5000;
  if (window.location.hostname !== "localhost" && window.location.port)
    port = window.location.port;

  return `${window.location.protocol}//${window.location.hostname
    }:${port}${path}${token ? `?token=${token}` : ""}${params}`;
};

const connectToP2PSignaler = connectCb => {
  const SIGNALING_SERVER = getHost("/p2p", lastToken);
  return openSocket(SIGNALING_SERVER);
};

const connectToP2PChannel = (channel, audio, video) => {
  const CHANNEL_ENDPOINT = getHost(
    `/p2p/${channel}`,
    lastToken,
    `${`&audio=${audio}`}${`&video=${video}`}`
  );
  return openSocket(CHANNEL_ENDPOINT);
};

const connectSocket = (cbConnected, cbDisconnected, token = null) => {
  if (isConnected()) return;

  if (token) token = token.slice("Bearer_".length);
  lastToken = token;

  // const targetURL = `https://${window.location.hostname}:${process.env.PORT ||
  //   5050}${token ? `?token=${token}` : ""}`;

  const targetURL = getHost("", token);
  console.log("Connecting socket to ", targetURL);

  if (socket) {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("reconnect");
  }

  // socket = openSocket(targetURL, { secure: true });
  socket = openSocket(targetURL, { secure: isSecure });
  socket.on("connect", () => {
    console.log("socket connected", socket.id);
    cbConnected();
  });

  socket.on("disconnect", reason => {
    console.log("socket DISconnected", reason);
    cbDisconnected();
  });

  socket.on("reconnect", () => {
    cbConnected();
    console.log("socket reconnected");
  });

  socket.on("peerSignalMessage", (otherClientId, roomId, message) => {
    console.log("Received peer signal", otherClientId, roomId, message);

    window.p2pEvents.dispatch(
      PEER_SIGNAL_MESSAGE,
      otherClientId,
      roomId,
      message
    );
  });

  socket.on("genericRoomMessage", (roomId, message) => {
    console.log("Received genericRoomMessage", roomId, message);

    window.socketEvents.dispatch("GENERIC_ROOM_MESSAGE", roomId, message);
  });
};

const disconnectSocket = () => {
  if (isConnected()) {
    socket.disconnect();
  }
};

const subscribeToTimer = (interval, cb) => {
  socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("subscribeToTimer", interval);
};

export const ownSocketId = () => {
  if (!socket) return "";
  return socket.id;
};

/**
 * Generic Events (lightweight, eventually not part of redux state, e.g. draw)
 */
export const registerTo = (event, callback) => {
  socket.on(event, callback);
};

export const unregisterFrom = (event, callback) => {
  socket.off(event, callback);
};

/**
 * 
 * SCRIPT 
 *  
 */
//connects to script member and updates when member subscribes to script

export const scriptMembers = (scriptId, users) => {
  console.log("hallo");
};





  /**
   * LOBBY
   */

  const subscribeToLobby = (cb, usersCb) => {
    socket.on("lobbyUpdate", update => cb(update));
    socket.on("lobbyUsers", users => usersCb(users));
    socket.emit("subscribeToLobby");
  };

  const unsubscribeFromLobby = () => {
    if (isConnected()) {
      socket.off("lobbyUpdate");
      socket.emit("unsubscribeFromLobby");
    }
  };

  /**
   * ROOMS
   */

  const subscribeToRoom = (roomId, cb, usersCb, errorCb) => {
    unregisterRoomEvents(roomId);

    // if (!isConnected()) return; // this will prevent joining a session

    console.log("Subscribe to room", roomId);
    socket.on("roomUpdate_" + roomId, update => {
      socket.off("roomReject_" + roomId); // success

      cb(update);
    });
    socket.on("roomUsers_" + roomId, users => usersCb(users));

    socket.on("roomReject_" + roomId, error => {
      socket.off("roomUpdate_" + roomId);
      socket.off("roomUsers_" + roomId);

      console.log("ROOM REJECT", roomId);

      errorCb(error);
    });

    if (roomId.indexOf("_stream") !== -1) socket.emit("joinStreamRoom", roomId);
    else socket.emit("subscribeToRoom", roomId);
  };

  const unsubscribeFromRoom = roomId => {
    console.log("unsubscribe to room", roomId);
    unregisterRoomEvents(roomId);
    if (isConnected()) {
      socket.emit("unsubscribeFromRoom", roomId);
    }
  };

  const unregisterRoomEvents = roomId => {
    socket.off("roomUpdate_" + roomId);
    socket.off("roomUsers_" + roomId);
    socket.off("roomReject");
  };

  /**
   * SESSIONS
   */

  const createSession = (sessionName, videoUrl, sessionType) => {
    socket.emit("createSession", sessionName, videoUrl, sessionType);
  };

  // param: time
  const subscribeToHeartBeat = cb => {
    socket.on("heartBeat", cb);
  };

  const unSubscribeHeartBeat = () => {
    socket.off("heartBeat");
  };

  // Send shared data => will result in room update
  // will be persistent while room session on server
  // client value: stored under clients id
  export const sendSharedRoomData = (
    roomId,
    property,
    value,
    clientValue = false
  ) => {
    socket.emit("setSharedProperty", roomId, property, value, clientValue);
  };

  export const fetchAnnotations = roomId => {
    socket.emit("fetchAnnotations", roomId);
  };

  export const sendSharedAnnotation = (
    roomId,
    playtime,
    meta,
    clientValue = false
  ) => {
    socket.emit("setSharedAnnotation", roomId, playtime, meta, clientValue);
  };

  export const removeSharedAnnotation = (
    roomId,
    playtime,
    clientValue = false
  ) => {
    socket.emit("removeSharedAnnotation", roomId, playtime, clientValue);
  };

  export const shareLocalState = (roomId, stateKey, stateValue) => {
    socket.emit("shareLocalState", roomId, stateKey, stateValue);
  };

  export const broadcastHeartBeat = (roomId, time) => {
    socket.emit("broadcastHeartBeat", roomId, time);
  };

  // Send shared data => will result in room update
  // transient, not saved on server
  // client value: stored under clients id
  export const shareTransientAwareness = (roomId, property, value, ignoreMe) => {
    socket.emit("shareTransientAwareness", roomId, property, value, ignoreMe);
  };

  export const sendChatMessage = (roomId, message, receiver = -1) => {
    socket.emit("chatMessage", roomId, message, receiver);
  };

  export const sendPeerSignalMessage = (roomId, message, receiver) => {
    socket.emit("peerSignalMessage", roomId, message, receiver);
  };

  export const sendDraw = (roomId, x0, y0, x1, y1, color) => {
    socket.emit("draw", roomId, x0, y0, x1, y1, color);
  };

  export const sendGenericRoomMessage = (roomId, message) => {
    socket.emit("genericRoomMessage", roomId, message);
  };

  // todo: extract role on server side
  export const sendRoleReadyState = ready => {
    sendScriptProcessorMessage("readyState", !!ready);
  };

  export const sendScriptProcessorMessage = (type, data = null) => {
    socket.emit("scriptMessage", { type: type, value: data });
  };

  // export const joinStreamRoom = sessionRoomId => {
  //   socket.emit("joinStreamRoom", sessionRoomId);
  // };

  const isConnected = () => {
    return socket && socket.connected;
  };

  export {
    subscribeToTimer,
    subscribeToLobby,
    unsubscribeFromLobby,
    subscribeToRoom,
    unsubscribeFromRoom,
    connectSocket,
    disconnectSocket,
    createSession,
    subscribeToHeartBeat,
    unSubscribeHeartBeat,
    connectToP2PSignaler,
    connectToP2PChannel
  };
