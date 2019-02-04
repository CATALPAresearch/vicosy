const PeerTeachingProcessorItem = require("./peer-teaching-processor-item");

const VideoDBApi = require("../../models/Video");
const Video = VideoDBApi.video;

/**
 * Precondition: The peers intoduced themselves and set up appropriate communication
 *
 * In this phase the peers will separate the video in sections they will present in an alternating way
 *
 * Finish condition: 2 peers are ready to continue
 * Outcome: A list of sections => next steps (pt-items) will be generated
 */
module.exports = class PeerTeachingItemSeparateSections extends PeerTeachingProcessorItem {
  constructor(sessionData, sessionProcessor, onCompleteCb) {
    super(
      sessionData,
      sessionProcessor,
      "PHASE_SEPARATE_SECTIONS",
      onCompleteCb
    );

    // holds foreign section annotations that can be requested by client optionally
    this.annotationsBuffer = {};
  }

  execute() {
    // if section annotation already available => save them transient and set info in payload
    Video.findOne({ url: this.sessionData.meta.videoUrl }).then(video => {
      if (video && video.annotations) {
        // annotations are an array here => transform to object

        for (let i = 0; i < video.annotations.length; i++) {
          const annotation = video.annotations[i];

          if (!annotation.type || annotation.type !== "annotation-section")
            continue;
          // hint: annotation contains time => delete property?
          this.annotationsBuffer[annotation.time] = {
            title: annotation.title,
            text: annotation.text,
            type: annotation.type
          };
        }
      }

      super.execute();
    });
  }

  onPeerMemberMessage(data) {
    if (data.type === "fetchForeignSections") {
      console.log("sections requested", this.annotationsBuffer);

      this.sessionProcessor.adjustRoomData("annotations", {
        ...this.annotationsBuffer
      });
    }
  }

  getPayload() {
    return {
      foreignSectionsAvailable: Object.keys(this.annotationsBuffer).length > 0
    };
  }

  onSessionDataChangedInternal() {
    if (super.areAllRolesReady()) {
      this.ignoreSessionDataChanges = true;
      this.saveCurrentSectionAnnotationsToDatabase();

      super.complete();
    }
  }

  saveCurrentSectionAnnotationsToDatabase() {
    if (!this.sessionData.annotations) return;

    const annotationKeys = Object.keys(this.sessionData.annotations);

    if (annotationKeys.length === 0) return;

    var annotationsArray = [];
    for (let i = 0; i < annotationKeys.length; i++) {
      const timeStamp = annotationKeys[i];
      const annotationData = this.sessionData.annotations[timeStamp];

      // if (!annotationData.type || annotationData.type !== "annotation-section")
      //   continue;

      annotationData.time = timeStamp;
      annotationsArray.push(annotationData);
    }

    // save sections to database to serve for future scripts
    Video.findOne({ url: this.sessionData.meta.videoUrl }).then(video => {
      var targetVideo = video;
      if (!targetVideo) {
        // create new Mongo resource: new [Modelname]([pass in data as object])
        targetVideo = new Video({
          url: this.sessionData.meta.videoUrl
        });
      }
      targetVideo.annotations = annotationsArray;
      targetVideo.save();
    });
  }

  getRolesRequiredReady() {
    return ["ROLE_TUTOR"];
  }
};
