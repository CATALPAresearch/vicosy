const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const roomLoggers = {};

const myFormat = printf(info => {
  return `${info.timestamp}: ${info.message}`;
});

function createRoomLogger(roomId) {
  return createLogger({
    level: "verbose",
    format: combine(timestamp(), myFormat),
    transports: [new transports.File({ filename: `logs/rooms/${roomId}.log` })]
  });
}

exports.logToRoom = function(roomId, logmessage) {
  if (!(roomId in roomLoggers)) roomLoggers[roomId] = createRoomLogger(roomId);

  roomLoggers[roomId].log({
    level: "verbose",
    message: logmessage
  });
};

exports.clearRoomLogger = function(roomId) {
  if (roomId in roomLoggers) {
    exports.logToRoom(roomId, "room cleared");
    delete roomLoggers[roomId];
  }
};
