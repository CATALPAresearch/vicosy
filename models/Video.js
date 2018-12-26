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
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: false
      },
      text: {
        type: String,
        required: false
      }
    }
  ]
});

module.exports = Video = mongoose.model("videos", VideoSchema);
