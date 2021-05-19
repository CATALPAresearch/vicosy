import openSocket from "socket.io-client";
import { PEER_SIGNAL_MESSAGE } from "../p2p-handlers/p2pEvents";
/*
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
Sharedb.types.register(richText.type);

var sharedDoc = null;
*/
var socket = null;
/*
const sharedSocket = new WebSocket('ws://127.0.0.1:8080');
const sharedConnection = new Sharedb.Connection(sharedSocket);*/
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

    socket.emit("connection");
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
 * Collaborative Docs
 * 
 */

// Querying for our document
/*
export const connectSharedDocAPI = (docId) => {

  sharedDoc = sharedConnection.get('docs', 'firstDocument');
  console.log(sharedDoc);


};

export const subscribeSharedDocAPI = (userId, errorCb, setContentCb, updateCb) => {

  sharedDoc.subscribe(function (err) {
    if (err) errorCb(err);
  
    setContentCb(sharedDoc.data);

    sharedDoc.on('op', function (op, source) {
     if (source == userId) return;
      else
        updateCb(op, source);
    });
  });


}

export const submitOpAPI = (delta, source) => {
  
  sharedDoc.submitOp(delta, source);

}
*/

export const subscribeSharedDocAPI = (docId) => {
  socket.emit("startSharedDoc", docId);

}
/**
 * ActivityEvents
 * 
 */

//emits active message to other clients
export const isActive = (sessionId, userName, userId, clients) => {

  var message = {};
  message.userName = userName;

  message.sessionId = sessionId;
  for (var client in clients) {
    if (client !== userId) {
      message.userId = client;
      console.log("emit active message");
      socket.emit("activemessage", message);
    }
  }
}


//listens to Active message
export const listenActiveMessage = (userId, cb) => {
  socket.on("activemessage" + userId, message => { cb(message) });

}


//emits tab Focus lost
export const sendTabLostMsg = (sessionId, userName, userId, clients) => {

  var message = {};
  message.userName = userName;

  message.sessionId = sessionId;
  for (var client in clients) {
    if (client !== userId) {
      message.userId = client;
      console.log("emit tablost message");
      socket.emit("tablostmessage", message);
    }
  }
}

//listens to TabLost message
export const listenTabLostMessage = (userId, cb) => {
  socket.on("tablostmessage" + userId, message => { cb(message) });

}



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
 * DOC events 
 *  
 */
// connects doc to database


export const storeIndivDocApi = (text, docId) => {
  let content = {};
  content.text = text;
  content.docId = docId;
  socket.emit("storeIndivDoc", content);
};

export const storeSharedDocApi = (text, docId) => {
  let content = {};
  content.text = text;
  content.docId = docId;
  socket.emit("storeSharedDoc", content);
};


/**
 * 
 * SCRIPT 
 *  
 */
//connects to script member and updates when member subscribes to script

//if TRainer deletes SCript it will be removed
export const removedScript = (userId, callback) => {
  socket.on("removedScript" + userId, scriptId => callback(scriptId));
}

export const scriptMembers = (scriptId, user_id, callback) =>

  socket.on("returnScriptMembers", datum => {
    if (datum.userId === user_id) callback(datum);
  });


export const getSessions = (user_id, callback) => {
  socket.on("newScript" + user_id, script => {
    console.log("nachricht angebkommen");
    callback(script);
  })
}

//notifies members of a script
export const notifyMembers = (script) => {
  socket.emit("notifyMembers", script);
}


export const subscribeToScriptSocket = (scriptId) => {

  socket.emit("subscribeToScriptSocket", scriptId);
  //socket.on("returnScriptMembers", update => users(update));
  // socket.on("testnachricht", data => console.log(data))

};

export const getNewScripts = (userId, callback) => {
  socket.on("newScript" + userId, script => callback);
}







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


export const evalLogToRoom = (scriptId, roomId, message) => {
  socket.emit("evalLogToRoom", scriptId, roomId, message);
}

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

export const createTrainerSession = (scriptId, sessionName, videoUrl, sessionType, groupId) => {
  socket.emit("createTrainerSession", scriptId, sessionName, videoUrl, sessionType, groupId);
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

