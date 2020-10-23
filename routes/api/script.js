
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateScriptInput = require("../../validation/script");

// load script model
const Script = require("../../models/Script");


// @route GET api/script/test
// @desc Test script route
// @access Public

router.get("/test", (req, res) => {
    res.json({ msg: "Script works" });
});

// @route   POST api/script/newscript
// @desc    Save new script
// @access  Public

router.post("/newscript", (req, res) => {
    console.log("error");
    const { errors, isValid } = validateScriptInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newScript = new Script({
        scriptName: req.body.scriptName,
        userId: req.body.userId,
        videourl: req.body.videourl,
        sessionType: req.body.sessionType,
        groupSize: req.body.groupSize,
        groupMix: req.body.groupMix,
        themes: req.body.themes,
        isPhase5: req.body.isPhase5,
        phase0Assignment: req.body.phase0Assignment,
        phase5Assignment: req.body.phase5Assignment,
    });

    newScript.save()
        .then(script => res.json(script))
        .catch(err => console.log(err));
});

module.exports = router;
