import { STREAM_AVAILABLE, STREAM_BEFORE_CLEAR } from "./streamEvents";
import {
  ROOM_LEFT,
  USER_LEFT_ROOM
} from "../components/logic-controls/socketEvents";

var roomsToClientStream = {};

function onUserLeftRoom(roomId) {
  if (roomId in roomsToClientStream) {
    const clientIds = Object.keys(roomsToClientStream[roomId]);
    clientIds.forEach(clientId => clearUserStream(roomId, clientId));
    delete roomsToClientStream[roomId];
  }
}

function clearUserStream(roomId, userId) {
  console.log("before clear user", userId, roomsToClientStream);
  if (roomId in roomsToClientStream && userId in roomsToClientStream[roomId]) {
    const stream = roomsToClientStream[roomId][userId];
    if (stream) {
      clearStream(stream, roomId, userId);
    }

    delete roomsToClientStream[roomId][userId];
    console.log("clear users stream", userId, roomsToClientStream);
  }
}

function clearStream(stream, roomId, userId) {
  window.streamEvents.dispatch(STREAM_BEFORE_CLEAR, roomId, userId);
  stream.getTracks().forEach(track => track.stop());
}

export const registerStream = (roomId, clientId, stream) => {
  // if room doesn't exist anymore => instantly clear stream
  // if (!roomId in store.getState().rooms.rooms) {
  //   clearStream(stream, roomId, clientId);
  //   return;
  // }

  if (!window.socketEvents.has(ROOM_LEFT, onUserLeftRoom)) {
    window.socketEvents.add(ROOM_LEFT, onUserLeftRoom);
    window.socketEvents.add(USER_LEFT_ROOM, clearUserStream);
  }

  roomsToClientStream.getAdd(roomId)[clientId] = stream;
  console.log("registered stream", roomsToClientStream);

  window.streamEvents.dispatch(STREAM_AVAILABLE, roomId, clientId);
};

export const unregisterStream = (roomId, clientId) => {
  clearUserStream(roomId, clientId);
};

export const getStream = (roomId, clientId) => {
  if (!roomsToClientStream[roomId]) return null;
  return roomsToClientStream[roomId][clientId];
};
