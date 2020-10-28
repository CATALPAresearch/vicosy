const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Members
const MemberSchema = new Schema({
    expLevel: {
        type: Number,
        require: false
    }
})

//Groups
const GroupSchema = new Schema({
    groupMembers: [MemberSchema],
    required: false
})

// Create Schema
const ScriptSchema = new Schema({

    userId: {
        type: String,
        required: true
    },
    scriptName: {
        type: String,
        required: true
    },
    videourl: {
        type: String,
        required: true
    },
    scriptType:
    {
        type: String,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    groupMix: {
        type: String,
        required: true
    },
    themes: {
        type: String,
        required: true
    },
    isPhase0: {
        type: Boolean,
        required: true
    },
    isPhase5: {
        type: Boolean,
        required: true
    },
    phase0Assignment: {
        type: String,
        required: false
    },
    phase5Assignment: {
        type: String,
        required: false
    },
    participants: {
        type: [MemberSchema],
        required: false
    },
    groups: {
        type: [GroupSchema],
        require: false
    },
    status: {
        type: String,
        required: false
    },
}
);

module.exports = User = mongoose.model("script", ScriptSchema);