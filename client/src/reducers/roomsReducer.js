import {
  UPDATE_ROOM,
  ROOM_USERS,
  LOG_TO_CHAT,
  UPDATE_PLAYTIME
} from "../actions/types";
import {
  MESSAGE_SYNCHACTION,
  MESSAGE_JOINLEAVE,
  MESSAGE_LOG
} from "../shared_constants/systemChatMessageTypes";
import { ownSocketId } from "../socket-handlers/api";
import {
  ROOM_LEFT,
  USER_LEFT_ROOM,
  ROOM_JOINED,
  USER_JOINED_ROOM
} from "../components/logic-controls/socketEvents";

// [roomId]: {roomId: "", clients : []}
const initialState = {
  rooms: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ROOM:
      const roomIdToUpdate = action.payload.roomId;
      const roomsToUpdate = state.rooms;

      const updateType = action.payload.updateType;
      const isFullUpdate = updateType === "full" || updateType === undefined;
      const subscribed =
        (!isFullUpdate && roomIdToUpdate in state.rooms) ||
        action.payload.subscribedToRoom;
      // payload: {roomId: roomId, subscribedToRoom: true/false}

      if (!subscribed) {
        if (roomIdToUpdate in state.rooms) {
          delete roomsToUpdate[roomIdToUpdate];
          setTimeout(() => {
            window.socketEvents.dispatch(ROOM_LEFT, roomIdToUpdate);
          }, 200);
        }
      } else if (subscribed) {
        if (!(roomIdToUpdate in state.rooms))
          roomsToUpdate[roomIdToUpdate] = {};

        console.log("updatetype", updateType);
        if (updateType === "full") {
          roomsToUpdate[roomIdToUpdate].state = action.payload;
          setTimeout(() => {
            window.socketEvents.dispatch(
              ROOM_JOINED,
              roomIdToUpdate,
              roomsToUpdate[roomIdToUpdate].state
            );
            console.log("dispatch room joined", roomIdToUpdate);
          }, 200);
        } else if (updateType === "sharedRoomData") {
          var roomState = roomsToUpdate[roomIdToUpdate].state;
          roomsToUpdate[roomIdToUpdate].state = {
            ...roomState,
            sharedRoomData: action.payload.sharedRoomData
          };
          console.log("current room state", roomState);
        } else if (updateType === "sharedRoomDataPart") {
          const part = action.payload;
          var roomState = roomsToUpdate[roomIdToUpdate].state;
          var sharedData = roomState.sharedRoomData;
          if (!sharedData) sharedData = {};

          var assignTarget = part.clientId
            ? sharedData.getAdd("clients").getAdd(part.clientId)
            : sharedData;

          if (part.propertyPath)
            assignTarget.setAtPath(part.propertyPath, part.value);
          else if (part.property2)
            assignTarget.getAdd(part.property)[part.property2] = part.value;
          else assignTarget[part.property] = part.value;

          // checkLogToChat(roomState, part.property, part.value);

          roomsToUpdate[roomIdToUpdate].state = {
            ...roomState,
            sharedRoomData: sharedData
          };
          // console.log("current room state", roomState);
        } else if (updateType === "removeSharedRoomDataPart") {
          const part = action.payload;
          var roomState = roomsToUpdate[roomIdToUpdate].state;
          var sharedData = roomState.sharedRoomData;

          try {
            if (part.propertyPath) sharedData.deleteAtPath(part.propertyPath);
            else if (part.property2) {
              delete sharedData[part.property][part.property2];
            } else {
              delete sharedData[part.property];
            }
          } catch (err) {}

          roomsToUpdate[roomIdToUpdate].state = {
            ...roomState,
            sharedRoomData: sharedData
          };
        } else if (updateType === "chatMessage") {
          const chatMessageData = action.payload.chatMessage;
          var roomState = roomsToUpdate[roomIdToUpdate].state;
          if (!roomState.chat) roomState.chat = [];
          roomState.chat.push(chatMessageData);
        } else if (updateType === "transientAwareness") {
          var room = roomsToUpdate[roomIdToUpdate];

          var transientAwarenessData = room.transientAwareness;
          if (!transientAwarenessData) transientAwarenessData = {};

          if (!(action.payload.clientId in transientAwarenessData))
            transientAwarenessData[action.payload.clientId] = {};

          transientAwarenessData[action.payload.clientId][
            action.payload.property
          ] = action.payload.value;

          transientAwarenessData[action.payload.clientId].nick =
            action.payload.nick;

          roomsToUpdate[roomIdToUpdate] = {
            ...room,
            transientAwareness: transientAwarenessData
          };
        }
      }

      return {
        ...state,
        rooms: roomsToUpdate
      };
    case ROOM_USERS:
      console.log("ROOM action", action.type, action.payload);
      const roomIdClients = action.payload.roomId;
      const roomsClients = state.rooms;
      const leftId = action.payload.leftId;
      const joinedData = action.payload.joinedData;

      if (!(roomIdClients in roomsClients)) return;

      // todo: refactor => dipatch event, create a chat logger
      if (leftId) {
        checkLogToChat(roomsClients[roomIdClients].state, "user_left", leftId);

        try {
          delete roomsClients[roomIdClients].transientAwareness[leftId];
        } catch (err) {}
        try {
          delete roomsClients[roomIdClients].state.sharedRoomData.clients[
            leftId
          ];
        } catch (err) {}

        // const clients = action.payload.clients;
        // var firstRoomClientId = clients[0] ? clients[0] : "";

        window.socketEvents.dispatch(USER_LEFT_ROOM, roomIdClients, leftId);
      }

      if (joinedData) {
        roomsClients
          .getAdd(roomIdClients)
          .getAdd("state")
          .getAdd("sharedRoomData")
          .getAdd("clients")[joinedData.id] = joinedData;

        checkLogToChat(
          roomsClients[roomIdClients].state,
          "user_joined",
          joinedData.id
        );

        window.socketEvents.dispatch(
          USER_JOINED_ROOM,
          roomIdClients,
          joinedData.id
        );
      }

      // payload: array of user socket ids
      const clients = action.payload.clients;

      if (roomIdClients in state.rooms)
        roomsClients[roomIdClients].clients = clients;

      return {
        ...state,
        rooms: roomsClients
      };

    case LOG_TO_CHAT:
      const roomId = action.payload.roomId;

      if (!(roomId in state.rooms)) return;

      var roomState = state.rooms[roomId].state;

      logToChat(roomState, action.payload);
      return { ...state };

    case UPDATE_PLAYTIME:
      const { updatedTime } = action.payload;
      const updatedRoomId = action.payload.roomId;

      try {
        const roomsClients = state.rooms;
        var roomToUpdate = roomsClients[updatedRoomId];
        var lastSyncAction = roomToUpdate.state.sharedRoomData.syncAction;

        if (lastSyncAction.mediaAction === "play") {
          lastSyncAction.time = updatedTime;
          return { ...state, rooms: roomsClients };
        }
      } catch (e) {}

      return state;

    default:
      return state;
  }
}

function logToChat(roomState, payload) {
  const chatMessage = {
    type: MESSAGE_LOG,
    timestamp: new Date(),
    sender: "system",
    message: payload
  };
  roomState.chat.push(chatMessage);
}

function checkLogToChat(roomState, property, value) {
  if (!roomState.chat) roomState.chat = [];

  switch (property) {
    case "user_joined":
    case "user_left":
      logUserJoinedLeft(roomState, property, value);
      break;
    case "syncAction":
      logPlayBackAction(roomState, property, value);
      break;
    default:
      return;
  }

  console.log("log to chat", roomState, property, value);
}

function logPlayBackAction(roomState, property, synchAction) {
  // find sender data
  const senderSocketId = synchAction.sender;
  const clientData = roomState.sharedRoomData.clients[senderSocketId];

  const chatMessage = {
    type: MESSAGE_SYNCHACTION,
    timestamp: new Date(),
    sender: senderSocketId,
    nick: clientData.nick,
    color: clientData.color,
    private: false,
    message: { mediaAction: synchAction.mediaAction, time: synchAction.time }
  };
  roomState.chat.push(chatMessage);
}

function logUserJoinedLeft(roomState, action, userId) {
  // find sender data
  const senderSocketId = userId;

  if (ownSocketId() === senderSocketId) return;

  const clientData = roomState.sharedRoomData.clients[senderSocketId];
  if (!clientData) return;

  const chatMessage = {
    type: MESSAGE_JOINLEAVE,
    timestamp: new Date(),
    sender: senderSocketId,
    nick: clientData.nick,
    color: clientData.color,
    private: false,
    message: action === "user_joined" ? "joined!" : "left!"
  };
  roomState.chat.push(chatMessage);
}
