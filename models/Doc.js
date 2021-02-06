const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DocSchema = new Schema({

    _id: false,
    docId: {
        type: String,
        unique: true,
        required: true
    },
    text: {
        type: String,
        required: true
    }

});


var docModel = mongoose.model("docs", DocSchema);
module.exports = {
    docs: docModel,
    setIndividualText(text, docId) {
        docModel.findOneAndUpdate({ docId: docId }, { text: text }, { upsert: true }).then(doc => {
            console.log("Doc updated");
            console.log(doc);
        })
            .catch(errors => {
                console.log(errors);
                return res.status(400).json(errors);
            });
    },
    findHTMLByDocId(docId) {
        docModel.findOne({ docId: docId }, function (doc) { return doc; });
    }
}
