const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

module.exports = class PeerTeachingReflection extends PeerTeachingProcessorItem {
  constructor(sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_REFLECTION", onCompleteCb);

    this.payload = {
      sectionTime: { startTime: 0, endTime: -1 }
    };
  }

  getPayload() {
    return this.payload;
  }

  execute() {
    super.execute();

    // make sure dialog is closed
    this.sessionProcessor.adjustRoomData("dialogAction", {
      type: ""
    });
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
