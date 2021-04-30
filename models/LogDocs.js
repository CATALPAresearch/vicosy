const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const IndivTextSchema = new Schema({
    text: {
        type: String,
        required: false
    }
})

const LogDocSchema = new Schema({
    
    indivText: {
        indivText: [IndivTextSchema],
        required: false,
        status: String
    },
    collabText: {
        type: String,
        required: false
    },
    _id: {
        type: String,
        required: true
    }
})

module.exports = Script = mongoose.model("logdocs", LogDocSchema);
