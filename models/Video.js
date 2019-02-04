const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VideoSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  annotations: [
    {
      time: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: false
      },
      text: {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false
      }
    }
  ]
});

var videoModel = mongoose.model("videos", VideoSchema);

function getOrCreateVideoItem(url, callback) {
  videoModel
    .findOne({ url: url })
    .then(video => {
      var targetVideo = video;
      if (!targetVideo) {
        // create new Mongo resource: new [Modelname]([pass in data as object])
        targetVideo = new videoModel({
          url: url
        });
      }
      // targetVideo.annotations = annotationsArray;
      // targetVideo.save();
      callback(targetVideo);
    })
    .catch(err => {
      callback(null);
    });
}

// module.exports = Video = mongoose.model("videos", VideoSchema);
module.exports = {
  video: videoModel,
  setAnnotation: (url, time, title, text, type) => {
    getOrCreateVideoItem(url, video => {
      var annotations = video.annotations.slice();
      var foundIndex = annotations.findIndex(annotation => {
        return annotation.time === time;
      });

      var newAnnotation = { time, title, text, type };
      if (foundIndex !== -1) {
        annotations[foundIndex] = newAnnotation;
        console.log("replaced", url, time, title, text);
      } else {
        annotations.push(newAnnotation);
        console.log("added", url, time, title, text);
      }

      video.annotations = annotations;
      video.save().catch(err => {
        console.log(err);
      });
    });
  },
  removeAnnotation: (url, time) => {
    videoModel.findOne({ url: url }).then(video => {
      if (!video) return;

      var foundIndex = video.annotations.findIndex(annotation => {
        return annotation.time === time;
      });

      if (foundIndex !== -1) {
        var annotationsCpy = video.annotations.slice();
        annotationsCpy.splice(foundIndex, 1);

        video.annotations = annotationsCpy;
        video.save().catch(err => {
          console.log(err);
        });
      }
    });
  },
  getAnnotationsAsMap: (url, callback) => {
    videoModel
      .findOne({ url: url })
      .then(video => {
        if (!video) {
          callback(null);
          return;
        }

        var annotationsBuffer = {};

        for (let i = 0; i < video.annotations.length; i++) {
          const annotation = video.annotations[i];

          annotationsBuffer[annotation.time] = {
            title: annotation.title,
            text: annotation.text,
            type: annotation.type
          };
        }

        callback(annotationsBuffer);
      })
      .catch(err => {
        console.log(err);

        callback(null);
      });
  }
};
