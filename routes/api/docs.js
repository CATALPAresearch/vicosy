const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const Docs = require("../../models/Doc");
const LogDocs = require("../../models/LogDocs");


// @route   api/docs/logdocs
// @desc    Get indiv docs
// @access  Public
router.post("/logdocs", (req, res) => {
    var texte = [];
    LogDocs.findOne({ _id: req.body._id }).then(logdoc => {
        let exists = false;
        // console.log(logdoc.indivText);
        console.log(logdoc);

        if (logdoc) {
            if (logdoc.indivText) {
                for (var oldtext of logdoc.indivText.indivText)
                    texte.push(oldtext);
            }

            if (texte.length > 0) {

          
                for (var i = 0; i < texte.length; i++) {
                    if (texte[i]._id == req.body.user_id) {
                        texte[i].text = req.body.docs.indivText;
                        exists = true;
                    }


                }
            }
        }
        if (!exists) {
            var text = {};
            text._id = req.body.user_id;
            text.text = req.body.docs.indivText;
            texte.push(text);
        }
        var entry = {};
        entry.indivText = texte;
        LogDocs.findOneAndUpdate({ _id: req.body._id }, { indivText: entry, collabText: req.body.docs.collabText }, {
            new: true,
            upsert: true // Make this update into an upsert
        }).then(docs => {
            console.log("Texte geloggt");
            res.json(docs);

        })
            .catch(errors => {
                console.log(errors);
                return res.status(400).json(errors);
            });
    })





});


// @route   POST api/docs/getindivdoc
// @desc    Get indiv docs
// @access  Public
router.post("/getindivdoc", (req, res) => {
    console.log("Request individuel document");
    //console.log(req.body);

    Docs.docs.findOne(req.body).then(doc => {
        console.log(doc);
        res.json({
            doc
        });
    }
    ).catch(errors => {
        console.log(errors);
        return res.status(400).json("Document not available");
    }
    )

});
module.exports = router;

