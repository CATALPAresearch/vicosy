const sessionTypes = require("../client/src/shared_constants/sessionTypes");
const PeerTeachingProcessor = require("./peer-teaching/peer-teaching-processor");

exports.tryCreateSessionProcessor = function(
  meta,
  roomsData,
  emitSharedRoomData,
  socketIO
) {
  const processor = requestProcessorBySessionType(
    meta,
    meta.sessionType,
    roomsData,
    emitSharedRoomData,
    socketIO
  );

  return processor;
};

function requestProcessorBySessionType(
  meta,
  sessionType,
  roomsData,
  emitSharedRoomData,
  socketIO
) {
  switch (sessionType) {
    case sessionTypes.SESSION_PEER_TEACHING:
      // todo: create processor for session
      console.log("create peer teaching session processor");
      const ptProcessor = new PeerTeachingProcessor(
        meta,
        roomsData,
        emitSharedRoomData,
        socketIO
      );
      return ptProcessor;

    default:
      return null;
  }
}
