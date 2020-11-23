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


// @route GET api/script/test
// @desc Test script route
// @access Public

router.get("/test", (req, res) => {
    res.json({ msg: "Script works" });
});

// @route GET api/script/deleteallscripts
// @desc deletes all Scripts for User
// @access Public

router.post("/deleteallscripts", (req, res) => {
    Script.deleteMany({ userId: req.body._id }, (result, error) => { });
    res.json({ msg: "Alle Scripts gelöscht" });
});


// @route GET api/script/deletescript
// @desc deletes one Script
// @access Public

router.post("/deletescript", (req, res) => {
    Script.deleteOne({ _id: req.body._id }).then(script => {
        console.log("hier bin ich");
        res.json({ msg: "Script gelöscht", _id: req.body._id })
    }
    ).catch(errors => {
        return res.status(400).json(errors);
    }
    )

});


// @route   POST api/script/startscript
// @desc    start Script
// @access  Public
router.post("/startscript", (req, res) => {
    console.log(req.body);
    Script.findOneAndUpdate({ _id: req.body._id }, { started: true }, { useFindAndModify: false }).then(script => {
        console.log("Script started");
        script.started = true;
        res.json(script);
    })
        .catch(errors => {
            console.log(errors);
            return res.status(400).json(errors);
        });


})

// @route   POST api/script/getmyscripts
// @desc    Gets scripts where user is member
// @access  Public
router.post("/getmyscripts", (req, res) => {
    console.log("halllllllo");
    console.log(req);
})


// @route   POST api/script/getscriptbyid
// @desc    Get Script by Id
// @access  Public
router.post("/getscriptbyid", (req, res) => {


    Script.findById(req.body._id).then(script => {

        if (script) {
            console.log("Return Script by Id");
            res.json({
                script
            });


        } else {
            console.log("error getting Script by Id");
            let errors = {};
            errors.script = "Script does not exist";
            errors.warning = "Script does not exist";
            return res.status(400).json(errors);
        }
    }
    ).catch(errors => {
        return res.status(400).json(errors);


    })
});




// @route   POST api/script/getscriptsbyuserid
// @desc    Get Scripts with the same user Id
// @access  Public
router.post("/getscriptsbyuserid", (req, res) => {

    console.log(req.body);

    //let id = { userId: req.body._id };
    Script.find(req.body).then(scripts => {

        if (scripts) {
            console.log("Return Scripts by Id");
            res.json({
                scripts
            });


        } else {
            console.log("error getting Scripts by Id");
            let errors = {};
            errors.warning = "No Scripts available";
            return res.status(400).json(errors);
        }
    }
    ).catch(errors => {
        console.log(errors);
        return res.status(400).json(errors);
    }
    )

});



// @route   POST api/script/subscribetoscript
// @desc    Subcribe Student to Script
// @access  Public

router.post("/subscribetoscript", (req, res) => {
    console.log("add member");

    let member = {
        _id: req.body.userId,
        expLevel: req.body.expLevel,
        name: req.body.name
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
                    if (script.started == true) {
                        errors.warning = "Script ist schon gestartet, Einschreiben nicht mehr möglich";
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
            }

        })
    }
});


// @route   POST api/script/newscript
// @desc    Save new script
// @access  Public

router.post("/newscript", (req, res) => {
    const { errors, isValid } = validateScriptInput(req.body);
    // check validation
    console.log("script in backend not validated");
    if (!isValid) {
        return res.status(400).json(errors);
    }
    console.log(req.body);


    const newScript = new Script({
        scriptName: req.body.scriptName,
        userId: req.body.userId,
        videourl: req.body.videourl,
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


// @route   POST api/script/updatescript
// @desc    update script
// @access  Public
router.post("/updatescript", (req, res) => {
    console.log("update script");

    const { errors, isValid } = validateScriptInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newScript = ({
        _id: req.body._id,
        scriptName: req.body.scriptName,
        userId: req.body.userId,
        videourl: req.body.videourl,
        groupSize: req.body.groupSize,
        groupMix: req.body.groupMix,
        themes: req.body.themes,
        scriptType: req.body.scriptType,
        isPhase0: req.body.isPhase0,
        isPhase5: req.body.isPhase5,
        started: req.body.started,
        phase0Assignment: req.body.phase0Assignment,
        phase5Assignment: req.body.phase5Assignment,


    });
    console.log(newScript.themes);
    if (!isEmpty(req.body.groups)) {
        var newGroups = [];
        {
            for (var i = 0; i < req.body.groups.length; i++)
                newGroups.push({ groupMembers: req.body.groups[i].groupMembers });
        }
        newScript.groups = newGroups;
        console.log("groupupdate");
    }
    if (!isEmpty(req.body.participants))
        newScript.participants = req.body.participants;

    //  thisScript.replaceOne({ _id:req.body._id }, newScript);

    Script.findOneAndUpdate({ _id: req.body._id }, newScript).then(script => {
        console.log("Script updated");
        console.log(script);
        res.json(script);
    })
        .catch(errors => {
            console.log(errors);
            return res.status(400).json(errors);
        });



});

// @route   POST api/script/subscribetoscript
// @desc    Subcrube Student to Script
// @access  Public

router.post("/subscribetoscript", (req, res) => {
    console.log("add member");

    let member = {
        _id: req.body.userId,
        name: req.body.name,
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


module.exports = router;
