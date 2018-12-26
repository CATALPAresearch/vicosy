// base class for session processors
module.exports = class SessionProcessor {
  constructor(sessionData, emitSharedRoomData, socketIO) {
    this.sessionData = sessionData;
    this.emitSharedRoomData = emitSharedRoomData;
    this.socketIO = socketIO;

    this.phaseQueue = [];
    this.currentStep = null;

    this.nickToSockets = {};

    this.onSocketScriptMessage = this.onSocketScriptMessage.bind(this);
  }

  setSocket(socket) {
    const nick = socket.nick;
    this.nickToSockets[nick] = socket;

    socket.on("scriptMessage", data => {
      this.onSocketScriptMessage(nick, data);
    });
  }

  removeSocket(socket) {
    if (socket) {
      socket.removeAllListeners("scriptMessage");
      delete this.nickToSockets[socket.nick];
    }
  }

  onSocketScriptMessage(nick, data) {
    console.log("socket message", nick, data.type);

    if (this.currentStep) this.currentStep.onPeerScriptMessage(nick, data);
  }

  adjustRoomData(
    propertyPath = null,
    value = null,
    clientId = null,
    remove = false,
    broadcast = true
  ) {
    if (broadcast)
      this.emitSharedRoomData(
        this.socketIO,
        this.sessionData.meta.roomId,
        null,
        value,
        clientId,
        null,
        remove,
        propertyPath
      );

    if (remove) this.sessionData.deleteAtPath(propertyPath);
    else this.sessionData.setAtPath(propertyPath, value);
  }

  onRoomDataChanged() {}

  initialize() {}

  processQueue() {
    if (this.phaseQueue.length === 0) return;

    if (this.currentStep) this.currentStep.dispose();

    this.currentStep = this.phaseQueue.shift();
    if (this.currentStep) this.currentStep.execute();
  }

  // called from outsite before corresponding room was removed
  dispose() {
    this.nickToSockets = null;
    console.log("Session processor cleared");
  }
};
