const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

/**
 * Precondition: Get Together phase done, 2 peers connected, the starting roles are assigned
 *
 * In this phase an introduction is given and the advice to build up a videoconference.
 * The 2 peers will come to know each other
 *
 * Finish condition: 2 peers are ready to continue
 */
module.exports = class PeerTeachingItemWarmUp extends PeerTeachingProcessorItem {
  constructor(sessionData, processor, onCompleteCb) {
    super(sessionData, processor, "PHASE_WARM_UP", onCompleteCb);
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
