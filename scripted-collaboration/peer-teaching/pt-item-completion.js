const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

module.exports = class PeerTeachinCompletion extends PeerTeachingProcessorItem {
  constructor(sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_COMPLETION", onCompleteCb);
  }

  getPayload() {
    return this.payload;
  }

  execute() {
    super.execute();
  }

  onSessionDataChangedInternal() {
    // check if peers are ready, then continue

    if (super.areAllRolesReady()) {
      console.log("all roles ready!");

      super.complete();
    }
  }

  getRolesRequiredReady() {
    return ["ROLE_TUTOR", "ROLE_TUTEE"];
  }
};
