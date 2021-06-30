const chatMessageTypes = require("../client/src/shared_constants/chatmessage-types");
const https = require("https");
const fs = require("fs");
const keys = require("../config/keys");
const onChange = require("on-change");
const VideoDBApi = require("../models/Video");
const ScriptDBApi = require("../models/Script");
const DocDBApi = require("../models/Doc");
const UsersDBApi = require("../models/User");
const WebSocket = require('ws');
const sessionTypes = require("../client/src/shared_constants/sessionTypes");
const winston = require("../winston-setup");
const { logToEvalRoom, logToRoom, clearRoomLogger } = require("../winston-room-logger");
const {
  tryCreateSessionProcessor
} = require("../scripted-collaboration/processor-creator");
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");
const WebSocketJSONStream = require('websocket-json-stream');
const ShareDB = require('sharedb');
/*

shared mongodb - ist leider sehr langsam
const mongokeys = require("../config/keys");


const dbkeys = mongokeys.mongoURI;

ShareDB.types.register(require('rich-text').type);


const mongodb = require('mongodb');
const mongodbadapter = require('sharedb-mongo')({mongo: function(callback) {
  mongodb.connect(dbkeys, callback);
  console.log("Shared Mongodb connected");
}});

const shareDBServer = new ShareDB({'db': mongodbadapter});

*/

ShareDB.types.register(require('rich-text').type);




const roomsData = { lobby: {} };
const roomProcessors = {}; // room id => processor


module.exports = function handleSocketEvents(clientSocket, socketIO, sharedConnection) {

// initializes sessions when starting
  this.initSessions = function (callback) {

    ScriptDBApi.find({ started: true }).then(scripts => {
      for (var script of scripts) {
        for (var group of script.groups) {
          // console.log("Session: ", group._id, " initiating!");
          createTrainerSession(script, String(script._id), String(script.scriptName), String(script.videourl), String(script.scriptType), group);
          //clientSocket.emit("notifyMembers", script);
        }


      }

    }).catch(errors => {
      console.log(errors);
    });

  }


  //logToRoom for evaluation
  clientSocket.on("evalLogToRoom", (scriptId, roomId, message) => {
    logToEvalRoom(roomId, message);
    logToEvalRoom("scriptId" + scriptId, message);
  }
  );


  //notifies members in Script
  clientSocket.on("notifyMembers", script => {
    if (script.groups)
      for (var group of script.groups) {
        createTrainerSession(script, script._id, script.scriptName, script.videourl, script.scriptType, group);
      }

    var myGroup = {};
    if (script.participants)
      for (var member of script.participants) {

        for (var group of script.groups)
          for (var gmember of group.groupMembers)
            if (gmember._id == member._id) {
              myGroup = group;
            }
        console.log(member._id, "wird informiert!");
        clientSocket.to("studentlobby").emit("newScript" + member._id, script);

      }

  }

  )

  //subscribes to script
  clientSocket.on("subscribeToScriptSocket", scriptId => {

    ScriptDBApi.findById(scriptId).then(script => {
      clientSocket.to("memberlist").emit("returnScriptMembers", script);
    }).catch(
      errors => {
        clientSocket.to("memberlist").emit("returnScriptMembers", errors);
      });
  });



  /*
  * ACTIVITY
  **/

  clientSocket.on("activemessage", (message) => {

    clientSocket.to(message.sessionId).emit("activemessage" + message.userId, message);

  });
  clientSocket.on("tablostmessage", (message) => {

    clientSocket.to(message.sessionId).emit("tablostmessage" + message.userId, message);

  });



  /*
   * DOCS
   * */
  /*individual doc ist stored in DB*/
  clientSocket.on("storeIndivDoc", content => {
    DocDBApi.setIndividualText(content.text, content.docId);
  });

  //collab doc is started
  clientSocket.on("startSharedDoc", docId => {
    console.log("startSharedDoc")
    var   sharedDoc = sharedConnection.get('docs', docId);

    sharedDoc.fetch(function (err) {
      if (err) throw err;
      if (sharedDoc.type === null) {

        /**
         * If there is no document with id "firstDocument" in memory
         * we are creating it and then starting up our ws server
         */


        sharedDoc.create([{ insert: 'Hier könnt ihr gemeinsam schreiben!' }], 'rich-text', () => {
                       
          console.log("New Doc created");

        });
        return;
      }
    });



  })

  /*
   * ROOMS
   * */
  clientSocket.on("subscribeToRoom", roomId => {
    if (!allowJoinRoom(roomId)) {
      console.log("room rejected", roomId);
      clientSocket.emit("roomReject_" + roomId, {
        errorCode: roomId,
        errorPayload: {
          roomReject: true,
          reason: `Session ${roomId} existiert nicht mehr. Aktualisiere die Seite, um sie wiederherzustellen. `,
          roomId: roomId
        }
      });

      return;
    }

    joinRoomInternal(socketIO, clientSocket, roomId);
  });

  clientSocket.on("unsubscribeFromRoom", roomId => {
    console.log("client unsubscribed from", roomId);
    clientSocket.leave(roomId);
    clientSocket.emit("roomUpdate_" + roomId, {
      updateType: "full",
      roomId: roomId,
      subscribedToRoom: false,
      sharedRoomData: null
    });
    emitRoomUsers(socketIO, roomId, clientSocket);
    logToRoom(roomId, `${clientSocket.nick}: left`);
  });

  /*
   * SESSION CREATION
   * */

  clientSocket.on("createSession", (roomName, videoUrl, sessionType) => {
    const roomId = (roomName + videoUrl).hashCode();
    console.log("create Session");

    if (roomId in roomsData) {
      console.log("ERROR: Session already available", roomId);
      return;
    }

    // for sessions requiring server logic we need to be able to listen to data changes
    roomsData[roomId] =
      sessionType === sessionTypes.SESSION_DEFAULT
        ? {}
        : createWatchableSessionRoom(roomId);
    const meta = {
      roomName: roomName,
      roomId: roomId,
      creator: { id: clientSocket.id, nick: clientSocket.nick },
      videoUrl: videoUrl,
      sessionType: sessionType,
      clientCount: 0
    };
    roomsData[roomId].isSession = true;
    roomsData[roomId].meta = meta;

    Object.assign(
      roomsData
        .getAdd("lobby")
        .getAdd("sessions")
        .getAdd(roomId),
      meta
    );

    // creates collaboration script processor if required
    const processor = tryCreateSessionProcessor(
      meta,
      roomsData[roomId],
      emitSharedRoomData,
      socketIO
    );

    if (processor) roomProcessors[roomId] = processor;

    emitSharedRoomData(socketIO, "lobby", "sessions", meta, null, roomId);
    logToRoom(roomId, `Session created: ${JSON.stringify(meta)}`);

    if (processor) processor.initialize();
  });

  /*
     * TRAINERSESSION CREATION
     * */

  function createTrainerSession(script, scriptId, roomName, videoUrl, sessionType, group) {
    const roomId = String(group._id);

    //save space from unnessessary data
    // console.log(script);
    /*
        if (script._doc)
          var scriptshort = Object.assign({}, script._doc);
        else
          var scriptshort = Object.assign({}, script);
        scriptshort.groups = {};
        scriptshort.participants = {};
        */
    // console.log(scriptshort);
    if (roomId in roomsData) {
      // console.log("ERROR: TrainerSession already available", roomId);
      return;
    }


    // for sessions requiring server logic we need to be able to listen to data changes
    roomsData[roomId] =
      sessionType === sessionTypes.SESSION_DEFAULT
        ? {}
        : createWatchableSessionRoom(roomId);
    const meta = {
      roomName: roomName,
      roomId: roomId,
      creator: { id: clientSocket.id, nick: clientSocket.nick },
      videoUrl: videoUrl,
      sessionType: sessionType,
      clientCount: 0,
      scriptId: scriptId,
      themes: script.themes,
      isPhase0: script.isPhase0,
      phase0Assignment: script.phase0Assignment,
      isPhase5: script.isPhase5,
      phase5Assignment: script.phase5Assignment,
      groupSize: script.groupSize,
      group: script.group


    };
    roomsData[roomId].isSession = true;
    roomsData[roomId].meta = meta;

    Object.assign(
      roomsData
        .getAdd("studentlobby")
        .getAdd("sessions")
        .getAdd(roomId),
      meta
    );

    // creates collaboration script processor if required
    const processor = tryCreateSessionProcessor(
      meta,
      roomsData[roomId],
      emitSharedRoomData,
      socketIO
    );

    if (processor) roomProcessors[roomId] = processor;

    emitSharedRoomData(socketIO, roomId, "sessions", meta, null, roomId);
    logToRoom(roomId, `Session created: ${JSON.stringify(meta)}`);

    if (processor) processor.initialize();

  }


  /**
   * STREAM ROOMS
   */

  clientSocket.on("joinStreamRoom", sessionRoomId => {
    // if (!(sessionRoomId in roomsData)) return;

    const streamRoomId = sessionRoomId;

    if (!(streamRoomId in roomsData)) {
      roomsData.getAdd(streamRoomId)["streamRoomData"] = {
        broadcasterClientId: clientSocket.id
      };
    } else {
      // check if broadcaster is still in room
      const clientIds = Object.keys(roomsData[streamRoomId].clients);
      if (clientIds.length === 0) {
        roomsData.getAdd(streamRoomId)["streamRoomData"] = {
          broadcasterClientId: clientSocket.id
        };
      } else if (
        clientIds.indexOf(roomsData[streamRoomId].broadcasterClientId) === -1
      ) {
        roomsData.getAdd(streamRoomId)["streamRoomData"].broadcasterClientId =
          clientIds[0];
      }
    }

    joinRoomInternal(socketIO, clientSocket, streamRoomId);
  });

  /*
   * ROOMS SHARED SERVER DATA
   * */
  // todo: non generic actions, property path
  clientSocket.on(
    "setSharedProperty",
    (roomId, property, value, clientBased) => {
      console.log("setSharedProperty", roomsData[roomId], property, value);
      if (!roomsData[roomId]) roomsData[roomId] = {};

      if (clientBased) {
        roomsData[roomId].getAdd("clients").getAdd(clientSocket.id)[
          property
        ] = value;
      } else roomsData[roomId][property] = value;
      emitSharedRoomData(
        socketIO,
        roomId,
        property,
        value,
        clientBased ? clientSocket.id : null
      );

      logToRoom(
        roomId,
        `${clientSocket.nick} SharedProperty: ${property} => ${JSON.stringify(
          value
        )}`
      );
    }
  );

  clientSocket.on("shareLocalState", (roomId, stateKey, stateValue) => {
    if (!roomsData[roomId] || !roomsData[roomId].clients || !(clientSocket.id in roomsData[roomId].clients))
      return;

    roomsData[roomId]
      .getAdd("clients")
      .getAdd(clientSocket.id)
      .getAdd("remoteState")[stateKey] = stateValue;

    emitSharedRoomData(
      clientSocket,
      roomId,
      "remoteState",
      stateValue,
      clientSocket.id,
      stateKey
    );
  });

  //todo: add delete property to emitSharedRoomData / delete to value
  clientSocket.on("removeSharedAnnotation", (roomId, playtime, clientBased) => {
    if (!roomsData[roomId]) return;

    if (clientBased) {
      console.error("removing client based annotations not supported yet.");
    } else {
      if (roomsData[roomId].annotations)
        delete roomsData[roomId].annotations[playtime];
    }

    VideoDBApi.removeAnnotation(roomsData[roomId].meta.videoUrl, playtime);

    emitSharedRoomData(
      socketIO,
      roomId,
      "annotations",
      null,
      clientBased ? clientSocket.id : null,
      playtime,
      true
    );
  });

  clientSocket.on(
    "setSharedAnnotation",
    (roomId, playtime, meta, clientBased) => {
      //console.log("setSharedProperty", roomsData[roomId], property, value);
      if (!roomsData[roomId]) return;

      if (clientBased) {
        roomsData[roomId]
          .getAdd("clients")
          .getAdd(clientSocket.id)
          .getAdd("annotations")[playtime] = meta;
      } else roomsData[roomId].getAdd("annotations")[playtime] = meta;

      emitSharedRoomData(
        socketIO,
        roomId,
        "annotations",
        meta,
        clientBased ? clientSocket.id : null,
        playtime
      );
      // this.AssistentProcessor.setVideoAnnotation();

      VideoDBApi.setAnnotation(
        roomsData[roomId].meta.videoUrl,
        playtime,
        meta.title,
        meta.text,
        meta.type
      );

      logToRoom(
        roomId,
        `${clientSocket.nick} SharedAnnotation: ${playtime} => ${JSON.stringify(
          meta
        )}, clientbased: ${clientBased}`
      );
    }
  );

  // lightweight broadcast to stay in sync during playback
  clientSocket.on("broadcastHeartBeat", (roomId, time) => {
    console.log("broadcast HB", roomId, time);

    clientSocket.to(roomId).emit("heartBeat", time);
  });

  clientSocket.on("draw", (roomId, x0, y0, x1, y1, color) => {
    clientSocket.to(roomId).emit("draw", x0, y0, x1, y1, color);
  });

  clientSocket.on("fetchAnnotations", roomId => {
    if (!roomsData[roomId]) return;

    VideoDBApi.getAnnotationsAsMap(
      roomsData[roomId].meta.videoUrl,
      annotationMap => {
        if (!annotationMap) return;

        roomsData[roomId].annotations = annotationMap;

        emitSharedRoomData(
          socketIO,
          roomId,
          "annotations",
          annotationMap,
          null
        );
      }
    );
  });

  /*
   * ROOM TRANSIENT AWARENESS
   * */

  clientSocket.on(
    "shareTransientAwareness",
    (roomId, property, value, ignoreMe = false) => {
      // console.log(
      //   "shareTransientAwareness",
      //   roomsData[roomId],
      //   property,
      //   value
      // );
      logToRoom(
        roomId,
        `${clientSocket.nick} Awareness: ${property} => ${value}`
      );

      const sender = ignoreMe ? clientSocket : socketIO;
      // share awareness except with sender
      // clientSocket.to(roomId).emit("transientAwareness", clientSocket.id, property, value);
      sender.to(roomId).emit("roomUpdate_" + roomId, {
        updateType: "transientAwareness",
        roomId: roomId,
        clientId: clientSocket.id,
        nick: clientSocket.nick,
        property: property,
        value: value
      });
    }
  );

  /*
   * ROOMS CHAT
   * */

  clientSocket.on("chatMessage", (roomId, message, receiverId = -1) => {
    // this.AssistentProcessor.sentChatMessage();
    sendChatMessage(
      socketIO,
      roomId,
      message,
      chatMessageTypes.CHAT_DEFAULT,
      receiverId,
      clientSocket
    );
  });

  clientSocket.on("genericRoomMessage", (roomId, message) => {
    clientSocket.to(roomId).emit("genericRoomMessage", roomId, message);
  });

  /*
   * CLIENT DISCONNECT
   * */
  clientSocket.on("disconnecting", reason => {
    console.log("disconnect", reason);
    console.log("rooms", clientSocket.rooms);

    let rooms = Object.keys(clientSocket.rooms);

    for (var i = 0; i < rooms.length; i++) {
      const room = rooms[i];

      clientSocket.leave(room);
      if (room === clientSocket.id) continue;

      emitRoomUsers(socketIO, room, clientSocket);
      logToRoom(room, `${clientSocket.nick}: left`);
    }
  });

  /**
   * P2P Setup
   */
  clientSocket.on("peerSignalMessage", (roomId, message, receiverId) => {
    logToRoom(roomId, `Peer Signal: ${message} to ${receiverId}`);

    clientSocket
      .to(receiverId)
      .emit("peerSignalMessage", clientSocket.id, roomId, message);
  });
};

function joinRoomInternal(socketIO, clientSocket, roomId) {
  // console.log("client is subscribing to", roomId, roomsData[roomId]);
  clientSocket.join(roomId);
  const clientData = roomsData
    .getAdd(roomId)
    .getAdd("clients")
    .getAdd(clientSocket.id);

  Object.assign(clientData, {
    id: clientSocket.id,
    nick: clientSocket.nick,
    color: clientSocket.color
  });
  clientSocket.emit("roomUpdate_" + roomId, {
    updateType: "full",
    roomId: roomId,
    subscribedToRoom: true,
    sharedRoomData: roomsData[roomId]
  });

  if (roomProcessors[roomId]) {
    roomProcessors[roomId].setSocket(clientSocket);
  }

  emitRoomUsers(socketIO, roomId, null, clientData);
  logToRoom(roomId, `${clientSocket.nick}: joined`);
}

function sendChatMessage(
  socketIO,
  roomId,
  payload,
  messageType = "",
  receiverId = -1,
  senderSocket = null
) {
  const newMessage = {
    updateType: "chatMessage",
    roomId: roomId,
    chatMessage: {
      type: messageType,
      timestamp: new Date(),
      sender: senderSocket.id,
      nick: senderSocket.nick,
      color: senderSocket.color,
      private: false,
      message: payload
    }
  };

  logToRoom(roomId, `${senderSocket.nick}: ${payload}`);

  if (receiverId == -1) {
    socketIO.to(roomId).emit("roomUpdate_" + roomId, newMessage);
  } else {
    newMessage.chatMessage.private = true;
    socketIO.to(receiverId).emit("roomUpdate_" + roomId, newMessage);
  }
}

function emitRoomUsers(socketIO, roomId, leftSocket = null, joinedData = null) {
  var leftId = null;
  if (leftSocket) {
    leftId = leftSocket.id;
    if (roomProcessors[roomId]) roomProcessors[roomId].removeSocket(leftSocket);
  }

  socketIO.in(roomId).clients((error, clients) => {
    console.log("CLIENTS", clients);

    if (error) throw error;
    socketIO
      .to(roomId)
      .emit("roomUsers_" + roomId, { roomId, clients, leftId, joinedData }); // => [Anw2LatarvGVVXEIAAAD]

    onRoomClientsChanged(socketIO, roomId, clients.length, leftId);
  });
}

function onRoomClientsChanged(socketIO, roomId, clientCount, leftId) {
  const roomDataAvailable = roomsData.hasOwnProperty(roomId);
  if (
    roomDataAvailable &&
    clientCount <= 0 &&
    allowDeleteRoomOnLastLeft(roomId)
  )
    deleteRoom(socketIO, roomId);
  else if (!roomDataAvailable && clientCount >= 1) roomsData[roomId] = {};

  // console.log("LEFT ---------------------", leftId, roomId, clientCount, leftId in roomsData);
  if (roomId in roomsData && leftId) {
    if (leftId in roomsData[roomId]["clients"]) {
      delete roomsData[roomId]["clients"][leftId];
    }
  }

  if (roomId in roomsData) {
    if (roomsData[roomId].isSession) {
      adjustSessionMeta(socketIO, roomId, "clientCount", clientCount);
    }
  }
  // console.log("Roomclients changed", roomDataAvailable, Object.keys(roomsData));
}

function adjustSessionMeta(socketIO, roomId, property, value) {
  if (!roomId in roomsData || !roomsData[roomId].isSession) return;

  roomsData[roomId].meta[property] = value;

  Object.assign(
    roomsData
      .getAdd("lobby")
      .getAdd("sessions")
      .getAdd(roomId),
    roomsData[roomId].meta
  );

  emitSharedRoomData(
    socketIO,
    "lobby",
    "sessions",
    roomsData[roomId].meta,
    null,
    roomId
  );
}

function deleteRoom(socketIO, roomId) {
  if (roomProcessors[roomId]) {
    roomProcessors[roomId].dispose();
    delete roomProcessors[roomId];
  }

  if (
    roomsData.hasOwnProperty(roomId) &&
    roomsData[roomId].hasOwnProperty("isSession") &&
    roomsData[roomId].isSession
  ) {
    delete roomsData["lobby"].sessions[roomId];
    emitSharedRoomData(socketIO, "lobby", "sessions", null, null, roomId);
  }

  delete roomsData[roomId];
  clearRoomLogger(roomId);
}

function allowDeleteRoomOnLastLeft(roomId) {
  if (roomId === "lobby") return false;

  // TODO: prevent to delete session room (or restore its persistent data beforehead)
  // handling for last media action needed => delete transient data!
  // if (roomsData[roomId].isSession) return false;
  return true;
}

function allowJoinRoom(roomId) {
  // check if room has to exist in order to allow join
  if (
    roomId === "lobby" ||
    roomId === "trainerlobby" ||
    roomId === "studentlobby" ||
    roomId.includes("memberlist") ||
    roomId === "WebRtcTestRoom" ||
    roomId === "WebRtcTestRoomWrapper"
  )
    return true;


  return roomsData.hasOwnProperty(roomId);
}

// todo: get rid of property & property2 and support path only
function emitSharedRoomData(
  emitter, // socketIO or clientSocket
  roomId,
  property = null,
  value = null,
  clientId = null,
  property2 = null,
  remove = false,
  propertyPath = null
) {
  // check if partly update
  if (property || propertyPath) {
    emitter.to(roomId).emit("roomUpdate_" + roomId, {
      updateType: remove ? "removeSharedRoomDataPart" : "sharedRoomDataPart",
      roomId: roomId,
      property: property,
      value: remove ? null : value,
      clientId: clientId,
      property2: property2, // property depth 2
      propertyPath: propertyPath // for deep digging
    });
  } else {
    emitter.to(roomId).emit("roomUpdate_" + roomId, {
      updateType: "sharedRoomData",
      roomId: roomId,
      sharedRoomData: roomsData[roomId]
    });
  }
}

function createWatchableSessionRoom(sessionId) {
  return onChange({}, () => {
    onSessionDataChange(sessionId);
  });
}

function onSessionDataChange(sessionId) {
  if (roomProcessors[sessionId]) roomProcessors[sessionId].onRoomDataChanged();
}
