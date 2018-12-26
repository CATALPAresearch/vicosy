const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

/**
 * Precondition: Section was prepared with annotations
 *
 * In this phase focussed collaboration will take place (sync)
 * The peer in the tutor role will present his prepared section
 *
 * Finish condition: 2 peers are ready to continue
 */
module.exports = class PeerTeachingPresentSection extends PeerTeachingProcessorItem {
  constructor(sectionTime, sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_PRESENT_SECTION", onCompleteCb);

    this.payload = {
      sectionTime: sectionTime
    };
  }

  getPayload() {
    return this.payload;
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
