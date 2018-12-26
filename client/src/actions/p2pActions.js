import { SET_MEDIA_STREAM, CLEAR_MEDIA_STREAM } from "./types";
import { sendSharedRoomData, ownSocketId } from "../socket-handlers/api";
import { hostPeer, joinPeer } from "../p2p-handlers/api";
import store from "../store";

export const offerPeer = (roomId, stream) => {
  hostPeer(roomId, stream, data => {
    // on signal => own peer ready
    if (!roomId in store.getState().rooms.rooms) return;

    sendSharedRoomData(roomId, "p2pData", JSON.stringify(data), true);
  });
};

export const consumePeer = (roomId, clientId, connectionId) => {
  joinPeer(roomId, clientId, connectionId);
};
