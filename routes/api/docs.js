const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const Docs = require("../../models/Doc");

// @route   POST api/docs/getindivdoc
// @desc    Get indiv docs
// @access  Public
router.post("/getindivdoc", (req, res) => {
    console.log("anfrage");
    console.log(req.body);

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

