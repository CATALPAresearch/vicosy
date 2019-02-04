const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

module.exports = class PeerTeachinDiscussion extends PeerTeachingProcessorItem {
  constructor(sectionTime, sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_DISCUSSION", onCompleteCb);

    this.payload = {
      sectionTime: sectionTime
    };
  }

  getPayload() {
    return this.payload;
  }

  execute() {
    super.execute();

    // make sure dialog is opened
    this.sessionProcessor.adjustRoomData("dialogAction", {
      type: "sharedDoc"
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
