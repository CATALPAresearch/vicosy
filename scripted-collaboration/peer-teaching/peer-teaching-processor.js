const SessionProcessor = require("../session-processor");
const PeerTeachingItemGetTogether = require("./pt-item-get-together");
const PeerTeachingItemSeparateSections = require("./pt-item-separate-sections");
const PeerTeachingItemWarmUp = require("./pt-item-warm-up");
const PeerTeachingPrepareSectionPair = require("./pt-item-prepare-section-pair");
const PeerTeachingPresentSection = require("./pt-item-present-section");
const PeerTeachingDeepenUnderStanding = require("./pt-item-deepen-understanding");
const PeerTeachingReflection = require("./pt-item-reflection");
const PeerTeachingDiscussion = require("./pt-item-discussion");
const PeerTeachingCompletion = require("./pt-item-completion");
// const winston = require("../../winston-setup");

module.exports = class PeerTeachingProcessor extends SessionProcessor {
  constructor(meta, sessionData, emitSharedRoomData, socketIO) {
    super(meta, sessionData, emitSharedRoomData, socketIO);



    this.processQueue = this.processQueue.bind(this);
    this.generateNextStepsBySectionsAndContinue = this.generateNextStepsBySectionsAndContinue.bind(
      this
    );
    this.switchRolesAndContinue = this.switchRolesAndContinue.bind(this);
  }

  initialize() {
    super.initialize();

    this.phaseQueue.push(
      new PeerTeachingItemGetTogether(
        this.sessionData,
        this,
        this.processQueue
      ));
    if (this.meta.isPhase0) {
      console.log("Vorstellungsphase erwünscht");
      this.phaseQueue.push(new PeerTeachingItemWarmUp(
        this.sessionData,
        this,
        this.switchRolesAndContinue
      ));
    }
    else { console.log("keine Vorstellungsphase"); }

    this.phaseQueue.push(new PeerTeachingItemSeparateSections(
      this.sessionData,
      this,
      this.generateNextStepsBySectionsAndContinue
    )
    );

    this.processQueue();
  }

  processQueue() {
    super.processQueue();
  }

  onRoomDataChanged() {
    super.onRoomDataChanged();

    if (this.currentStep) this.currentStep.onSessionDataChanged();
  }

  generateNextStepsBySectionsAndContinue() {
    // before calling complete, we need to extract the generated sections
    // so the processor can generate the next steps
    const sectionAnnotationsObj = this.sessionData.getAtPath("annotations", {
      0: { title: "dummy section", text: "" }
    });
    var sectionTimes = Object.keys(sectionAnnotationsObj);

    sectionTimes = sectionTimes.filter(time => {
      if (
        sectionAnnotationsObj[time].type &&
        sectionAnnotationsObj[time].type === "annotation-section"
      )
        return true;
      return false;
    });
    // sort annotations ascending
    sectionTimes.sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });

    console.log("generate next steps", sectionTimes);

    for (let i = 0; i < sectionTimes.length; i++) {
      const startTime = parseFloat(sectionTimes[i]);

      // since we dont have the video duration on BE, -1 is end of video
      const endTime = sectionTimes[i + 1]
        ? parseFloat(sectionTimes[i + 1])
        : -1; // next annotation is end time

      // the individual preparation step is only done
      // after a pair of sections was finished
      if (i % 2 === 0) {
        const startTimeSecond = sectionTimes[i + 1]
          ? parseFloat(sectionTimes[i + 1])
          : -1;
        const endTimeSecond = sectionTimes[i + 2]
          ? parseFloat(sectionTimes[i + 2])
          : -1;

        console.log(
          "PeerTeachingPrepareSectionPair added",
          startTime,
          sectionTimes[i + 1]
        );

        this.phaseQueue.push(
          new PeerTeachingPrepareSectionPair(
            { startTime, endTime },
            { startTime: startTimeSecond, endTime: endTimeSecond },
            this.sessionData,
            this,
            this.processQueue
          )
        );
      }

      console.log("Phasesstring added for", startTime);

      this.phaseQueue.push(
        new PeerTeachingPresentSection(
          { startTime, endTime },
          this.sessionData,
          this,
          this.processQueue
        ));

      this.phaseQueue.push(
        new PeerTeachingDeepenUnderStanding(
          { startTime, endTime },
          this.sessionData,
          this,
          this.switchRolesAndContinue
        )
        // new PeerTeachingReflection(
        //   { startTime, endTime },
        //   this.sessionData,
        //   this,
        //   this.switchRolesAndContinue
        // ),
        // new PeerTeachingDiscussion(
        //   { startTime, endTime },
        //   this.sessionData,
        //   this,
        //   this.switchRolesAndContinue
        // )
      );
    }
    if (this.meta.isPhase0) {
      console.log("Reflektionsphase erwünscht!");
      this.phaseQueue.push(
        new PeerTeachingReflection(this.sessionData, this, this.processQueue));

    }
    else
      console.log("Keine Reflektionsphase erwünscht!");

    this.phaseQueue.push(
      new PeerTeachingCompletion(this.sessionData, this, this.processQueue)
    );

    this.processQueue();
  }

  switchRolesAndContinue() {
    const rolesObj = { ...this.sessionData.collabScript.roles };

    const nicks = Object.keys(rolesObj);

    if (rolesObj[nicks[0]] === "ROLE_TUTOR") {
      rolesObj[nicks[0]] = "ROLE_TUTEE";
      rolesObj[nicks[1]] = "ROLE_TUTOR";
    } else {
      rolesObj[nicks[0]] = "ROLE_TUTOR";
      rolesObj[nicks[1]] = "ROLE_TUTEE";
    }

    super.adjustRoomData("collabScript.roles", rolesObj);

    this.processQueue();
  }
};
