import { subscribeToRoom, unsubscribeFromRoom } from "../socket-handlers/api";
import {
  UPDATE_ROOM,
  ROOM_USERS,
  GET_ERRORS,
  CLEAR_ERROR,
  LOG_TO_CHAT,
  UPDATE_PLAYTIME
} from "./types";
import store from "../store";

// Room login
export const loginRoom = roomId => dispatch => {
  if (hasJoinedRoom(roomId)) return;

  // TODO: subscribeToRoom return false if disconnect => join room after reconnect
  subscribeToRoom(
    roomId,
    update => {
      // {roomId: roomId, subscribedToRoom: true/false}
      dispatch({
        type: UPDATE_ROOM,
        payload: update
      });
    },
    users => {
      // {roomId: roomId, users: array of user socket ids}
      dispatch({
        type: ROOM_USERS,
        payload: users
      });
    },
    error => {
      dispatch({
        type: GET_ERRORS,
        payload: error
      });
    }
  );
};

// Room logout
export const logoutRoom = roomId => {
  // dispatch(clearRoomErrors(roomId));
  if (hasJoinedRoom(roomId)) unsubscribeFromRoom(roomId);

  return {
    type: UPDATE_ROOM,
    payload: { updateType: "full", roomId: roomId, subscribedToRoom: false }
  };
};

export const logoutRooms = () => dispatch => {
  const rooms = Object.keys(store.getState().rooms.rooms);

  rooms.forEach(roomId => {
    dispatch(logoutRoom(roomId));
  });
};

export const logToChat = (roomId, messageData) => {
  messageData.roomId = roomId;
  return {
    type: LOG_TO_CHAT,
    payload: messageData
  };
};

export const clearRoomErrors = roomId => {
  return {
    type: CLEAR_ERROR,
    payload: roomId
  };
};

export const updateRoomTime = (roomId, updatedTime) => {
  return {
    type: UPDATE_PLAYTIME,
    payload: { roomId, updatedTime }
  };
};

export const hasJoinedRoom = roomId => {
  console.log("has joined room?", roomId);

  return roomId in store.getState().rooms.rooms;
};
