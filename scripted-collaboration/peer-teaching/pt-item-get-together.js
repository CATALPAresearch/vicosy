const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

/**
 * Precondition: The emtpy session was created
 *
 * In this phase the 2 peers need to meet up.
 * The roles of tutor and tutee will be defined
 * based on the first joiner (= tutor) and the second (= tutee)
 *
 * finish condition: 2 peers joined the session
 */
module.exports = class PeerTeachingItemGetTogether extends PeerTeachingProcessorItem {
  constructor(sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_GET_TOGETHER", onCompleteCb);
  }

  onSessionDataChangedInternal() {
    // check if we have 2 clients in the session and proceed
    if (
      this.sessionData.clients &&
      Object.keys(this.sessionData.clients).length > 1
    ) {
      const clientIds = Object.keys(this.sessionData.clients);
      // first is tutor
      const tutorData = this.sessionData.clients[clientIds[0]];
      // second is tutee
      const tuteeData = this.sessionData.clients[clientIds[1]];

      // use nicks to identify peers, since clientIds changes on reconnect
      if (!tutorData.nick || !tuteeData.nick) return;

      this.ignoreSessionDataChanges = true;

      this.sessionProcessor.adjustRoomData("collabScript.roles", {
        [tutorData.nick]: "ROLE_TUTOR",
        [tuteeData.nick]: "ROLE_TUTEE"
      });

      console.log(
        "YEAH, you met the condition! There are 2 clients in the session!",
        clientIds,
        this.sessionData.clients
      );

      super.complete();
    }
  }
};
