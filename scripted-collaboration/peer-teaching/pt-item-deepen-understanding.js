const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

/**
 * Precondition: Section presented by tutor
 *
 * The tutor will now help the tutee to summarize the contents presented before in the shared doc
 *
 * Finish condition: 2 peers are ready to continue
 */
module.exports = class PeerTeachingDeepenUnderstanding extends PeerTeachingProcessorItem {
  constructor(sectionTime, sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_DEEPEN_UNDERSTANDING", onCompleteCb);

    this.payload = {
      sectionTime: sectionTime
    };
  }

  getPayload() {
    return this.payload;
  }

  execute() {
    super.execute();

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
