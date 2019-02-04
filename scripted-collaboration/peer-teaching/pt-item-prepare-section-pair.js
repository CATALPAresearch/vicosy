const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

/**
 * Precondition: All sections were defined
 *
 * In this phase indiviual (async) work will be done.
 * The peers will prepare their presentation of the corresponding section
 *
 * Finish condition: 2 peers are ready to continue
 */
module.exports = class PeerTeachingPrepareSectionPair extends PeerTeachingProcessorItem {
  constructor(
    tutorSectionTime,
    tuteeSectionTime,
    sessionData,
    processor,
    onCompleteCb
  ) {
    super(sessionData, processor, "PHASE_PREPARE_SECTION_PAIR", onCompleteCb);

    // setup the sections the peers will have to prepare
    // note: the roles here are only used for current identification
    // since the peers are equal in this phase they read like: the "next tutor" will prepare this
    // and the "next tutee" will prepare that section
    this.payload = {
      sectionTimes: {
        ROLE_TUTOR: tutorSectionTime,
        ROLE_TUTEE: tuteeSectionTime
      }
    };
  }

  execute() {
    super.execute();

    this.sessionProcessor.adjustRoomData("dialogAction", {
      type: ""
    });
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
