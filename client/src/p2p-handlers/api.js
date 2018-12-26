import Peer from "simple-peer";
import { ownSocketId } from "../socket-handlers/api";
import { registerStream } from "../stream-model/StreamModel";
import {
  ROOM_LEFT,
  USER_LEFT_ROOM
} from "../components/logic-controls/socketEvents";
import store from "../store";

// room id to hosted peer
var roomsToHostedPeer = {};

// room to clientId => joined peers
var roomsToClientPeers = {};

export const signalPeer = (roomId, otherId) => {
  console.log("connect", roomId, otherId, roomsToHostedPeer);
  roomsToHostedPeer[roomId].signal(JSON.parse(otherId));
};

export const hostPeer = (roomId, stream, onSignalCb) => {
  if (!roomId in store.getState().rooms.rooms) return;

  if (!window.socketEvents.has(ROOM_LEFT, onUserLeftRoom)) {
    window.socketEvents.add(ROOM_LEFT, onUserLeftRoom);
    window.socketEvents.add(USER_LEFT_ROOM, clearUserPeer);
  }

  // if (roomId in roomsToHostedPeer && roomsToHostedPeer[roomId]) return;
  const hostPeer = new Peer({
    initiator: true,
    trickle: false,
    stream: stream
  });

  roomsToHostedPeer[roomId] = hostPeer;

  //registerStream(roomId, ownSocketId(), stream);

  hostPeer.on("signal", onSignalCb);
};

export const joinPeer = (roomId, clientId, hostId) => {
  if (!roomId in store.getState().rooms.rooms) return;

  if (
    roomId in roomsToClientPeers &&
    clientId in roomsToClientPeers[roomId] &&
    roomsToClientPeers[roomId][clientId]
  )
    return;

  const consumePeer = new Peer({
    initiator: false,
    trickle: false
  });

  roomsToClientPeers.getAdd(roomId)[clientId] = consumePeer;
  console.log("JOINING PEER", clientId);

  consumePeer.on("stream", stream => {
    registerStream(roomId, clientId, stream);
    console.log("RECEIVING JOIN STREAM", clientId, stream);
  });

  consumePeer.on("close", () => {
    clearUserPeer(roomId, clientId);
  });

  consumePeer.on("signal", id => {
    console.log("joiners id", JSON.stringify(id));
  });

  consumePeer.signal(JSON.parse(hostId));
};

function onUserLeftRoom(roomId) {
  console.log("P2P BEFORE User left room", JSON.stringify(roomsToHostedPeer));

  // destroy hosted endpoint
  if (roomId in roomsToHostedPeer) {
    if (roomsToHostedPeer[roomId]) {
      roomsToHostedPeer[roomId].destroy();
      delete roomsToHostedPeer[roomId];
    }
  }

  // destroy all joiners endpoins
  if (roomId in roomsToClientPeers) {
    const clientIds = Object.keys(roomsToClientPeers[roomId]);
    clientIds.forEach(clientId => clearUserPeer(roomId, clientId));
    delete roomsToClientPeers[roomId];
  }

  console.log("P2P AFTER User left room", JSON.stringify(roomsToHostedPeer));
}

function clearUserPeer(roomId, userId) {
  console.log("before clear user", userId, roomsToClientPeers);
  if (roomId in roomsToClientPeers && userId in roomsToClientPeers[roomId]) {
    const peer = roomsToClientPeers[roomId][userId];
    if (peer) {
      peer.destroy();
    }

    delete roomsToClientPeers[roomId][userId];
    console.log("clear users stream", userId, roomsToClientPeers);
  }
}
