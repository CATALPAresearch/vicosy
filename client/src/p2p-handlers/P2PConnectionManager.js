// deprecated

import { ownSocketId } from "../socket-handlers/api";
import P2PConnection from "./P2PConnection";
import {
  ROOM_LEFT,
  ROOM_JOINED,
  USER_LEFT_ROOM,
  USER_JOINED_ROOM
} from "../components/logic-controls/socketEvents";
import { getStream } from "../stream-model/StreamModel";

// roomIds => otherClientId => P2PConnection
const directConnections = {};
// rooms have outgoing shared streams?
const streamingRooms = {};

window.socketEvents.add(ROOM_JOINED, onRoomJoined);
window.socketEvents.add(ROOM_LEFT, onRoomLeft);

window.socketEvents.add(USER_LEFT_ROOM, onUserLeft);
window.socketEvents.add(USER_JOINED_ROOM, onUserJoined);

function onRoomJoined(roomId, roomState) {
  directConnections[roomId] = {};
  console.log("P2P joined", roomId, roomState);

  if (roomState.roomId === "lobby") return;

  const clientIds = Object.keys(roomState.sharedRoomData.clients);
  clientIds.forEach(clientId => {
    initiateDirectConnection(roomId, clientId);
  });

  console.log("added p2p connections", directConnections);
}

function onRoomLeft(roomId) {
  console.log("P2P left", roomId);

  if (roomId !== "lobby" && roomId in directConnections) {
    delete streamingRooms[roomId];
    const clientIds = Object.keys(directConnections[roomId]);
    clientIds.forEach(clientId => clearUserPeer(roomId, clientId));
    delete directConnections[roomId];
  }

  console.log("deleted p2p connections", directConnections);
}

function onUserJoined(roomId, clientId) {
  if (roomId === "lobby") return;
  console.log("P2P client joined", roomId, clientId);
  initiateDirectConnection(roomId, clientId);
}

function onUserLeft(roomId, clientId) {
  console.log("P2P client left", roomId, clientId);
  clearUserPeer(roomId, clientId);
}

function clearUserPeer(roomId, clientId) {
  console.log("before clear user", clientId, directConnections);
  if (roomId in directConnections && clientId in directConnections[roomId]) {
    const peer = directConnections[roomId][clientId];
    if (peer) {
      peer.dispose();
    }

    directConnections[roomId][clientId] = null;
    delete directConnections[roomId][clientId];
    console.log("clear users connection", clientId, directConnections);
  }
}

function initiateDirectConnection(roomId, clientId) {
  if (clientId === ownSocketId()) return;

  console.log(
    "initiate direct connection",
    roomId,
    clientId,
    directConnections
  );

  if (roomId in directConnections && clientId in directConnections[roomId])
    return;

  const newConnection = new P2PConnection(roomId, clientId);
  directConnections.getAdd(roomId)[clientId] = newConnection;

  console.log(
    "created new direct connection",
    roomId,
    clientId,
    directConnections
  );

  if (roomId in streamingRooms && streamingRooms[roomId]) {
    console.log(
      "I am streaming, connect my stream to",
      roomId,
      clientId,
      directConnections
    );
    newConnection.applyOwnStream(getStream(roomId, ownSocketId()));
    newConnection.requestConnection();
  }
}

export const connectToAll = roomId => {
  const clientIds = Object.keys(directConnections[roomId]);

  clientIds.forEach(clientId => {
    directConnections[roomId][clientId].requestConnection();
  });
};

export const connectToAllAndStream = roomId => {
  const clientIds = Object.keys(directConnections[roomId]);

  clientIds.forEach(clientId => {
    const p2pConnection = directConnections[roomId][clientId];
    console.log("stream", roomId, ownSocketId());

    p2pConnection.applyOwnStream(getStream(roomId, ownSocketId()));
    p2pConnection.requestConnection();
  });

  streamingRooms[roomId] = true;
};

export const disconnectMyStream = roomId => {
  delete streamingRooms[roomId];

  if (roomId in directConnections) {
    const clientIds = Object.keys(directConnections[roomId]);

    clientIds.forEach(clientId => {
      const p2pConnection = directConnections[roomId][clientId];
      p2pConnection.removeOwnAppliedStream();
    });
  }
};
