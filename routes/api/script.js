const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load input validation
const validateScriptInput = require("../../validation/script");
const validateSuscribeInput = require("../../validation/subscribeToScript");
const isEmpty = require("../../validation/is-empty");


// load script model
const Script = require("../../models/Script");
const User = require("../../models/User");

// @route GET api/script/test
// @desc Test script route
// @access Public

router.get("/test", (req, res) => {
    res.json({ msg: "Script works" });
});


// @route   POST api/script/getscriptbyid
// @desc    Get Script by Id
// @access  Public
router.post("/getscriptbyid", (req, res) => {

    console.log(res.body);
    Script.findById(req.body._id).then(script => {

        if (script) {
            console.log("Return Script by Id");
            res.json({
                script
            });


        } else {
            console.log("error getting Script by Id");
            let errors = {};
            errors.script = "Script does not exist anymore";
            errors.warning = "Script does not exist anymore";
            return res.status(400).json(errors);
        }
    }
    )
});


// @route   POST api/script/getscriptbyidmemberinfo
// @desc    Get Script by Id with memberdetails
// @access  Public
router.post("/getscriptbyidmemberinfo", (req, res) => {
    
    Script.findById(req.body._id).then(script => {
        if (script) {
            console.log("Return Script by Id");

            var memberlist = [];

            var result = new Object;

            function rek(i, callback) {
                if (i < script.participants.length - 1) {
                    User.findById(script.participants[i]).then(user => {
                        member = {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            expLevel: script.participants[i].expLevel
                        };
                        memberlist.push(member);
                        rek(i + 1, callback);

                    });
                }
                else {
                    User.findById(script.participants[i]).then(user => {
                        member = {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            expLevel: script.participants[i].expLevel
                        };
                        memberlist.push(member);
                        callback();
                    })
                }
            }
            
            if (script.participants.length > 0)
                rek(0, () => {
                    result = {
                        _id: script._id,
                        videourl: script.videourl,
                        scriptName: script.scriptName,
                        groupSize: script.groupSize,
                        groupMix: script.groupMix,
                        themes: script.themes,
                        isPhase0: script.isPhase0,
                        isPhase5: script.isPhase5,
                        phase0Assignment: script.phase0Assignment,
                        phase5Assignment: script.phase5Assignment,
                        scriptType: script.scriptType,
                        userId: script.userId,

                    }
                    result.participants = memberlist;

                    console.log("tach");
                    console.log(result);
                    res.json({
                        result
                    });


                }

                );
            else res.json({
                script
            });
        } else {
            console.log("error getting Script by Id");
            let errors = {};
            errors.script = "Script does not exist anymore";
            errors.warning = "Script does not exist anymore";
            return res.status(400).json(errors);
        }
    }
    )
});



// @route   POST api/script/subscribetoscript
// @desc    Subcrube Learner to Script
// @access  Public

router.post("/subscribetoscript", (req, res) => {
    console.log("add member");

    let member = {
        _id: req.body.userId,
        expLevel: req.body.expLevel
    };
    //let script = { _id: req.body.scriptId };


    const { errors, isValid } = validateSuscribeInput(req.body);
    // check validation
    if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);

    }
    else {
        Script.findById(req.body.scriptId).then(script => {
            console.log(script);
            if (!script) {
                //pruefen ob schon drin
                errors.alert = "Script does not exist";
                return res.status(404).json(errors);
            }
            else {
                let ismember = false;
                script.participants.forEach(element => {
                    console.log(element);
                    if (element._id == member._id)
                        ismember = true;
                })
                if (ismember) { //pruefen ob schon drin
                    errors.warning = "User schon eingeschrieben";
                    return res.status(404).json(errors);
                }
                else {
                    script.participants.push(member);
                    script.save().then(script => {
                        /*
                                        script.updateOne({ _id: script._id }, { $push: { participants: member } }).then(script => {
                        */
                        console.log("Script updated");
                        res.json(script);
                    }
                    )
                        .catch(errors => {
                            console.log(errors);
                            return res.status(400).json(errors);
                        });
                }
            }
            /*
           if (!user) {
                
            }
            */

        })
    }
    /*
    console.log("Eishockey");
    User.findOne({}).then(user => {
        // check for user
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }
    }
    */


    /*
        newScript.save()
            .then(script => {
                console.log("Script saved");
                res.json(script);
            })
            .catch(errors => {
                console.log(errors);
                return res.status(400).json(errors)
            });
    
    */
});


// @route   POST api/script/newscript
// @desc    Save new script
// @access  Public

router.post("/newscript", (req, res) => {
    console.log("hier");
    console.log(req.body);
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
        scriptType: req.body.scriptType,
        isPhase0: req.body.isPhase0,
        isPhase5: req.body.isPhase5,
        phase0Assignment: req.body.phase0Assignment,
        phase5Assignment: req.body.phase5Assignment,
    });
    newScript.save()
        .then(script => {
            console.log("Script saved");
            console.log(script);
            res.json(script);
        })
        .catch(errors => {
            console.log(errors);
            return res.status(400).json(errors)
        });


});


// @route   POST api/script/updatecript
// @desc    update script
// @access  Public

router.post("/updatescript", (req, res) => {

    const { errors, isValid } = validateScriptInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    thisScript = new Script();

    const newScript = ({
        _id: req.body._id,
        scriptName: req.body.scriptName,
        userId: req.body.userId,
        videourl: req.body.videourl,
        sessionType: req.body.sessionType,
        groupSize: req.body.groupSize,
        groupMix: req.body.groupMix,
        themes: req.body.themes,
        scriptType: req.body.scriptType,
        isPhase0: req.body.isPhase0,
        isPhase5: req.body.isPhase5,
        phase0Assignment: req.body.phase0Assignment,
        phase5Assignment: req.body.phase5Assignment,
    });
    thisScript.updateOne({ _id: req.body._id }, newScript).then(script => {
        console.log("Script updated");
        res.json(newScript);
    })
        .catch(errors => {
            console.log(errors);
            return res.status(400).json(errors);
        });



});





module.exports = router;
