const express = require("express");
const router = express.Router();
// const Docs = require("../../models/Doc");

// @route   POST api/docs/getindivdoc
// @desc    Get indiv docs
// @access  Public
router.post("/getindivdoc", (req, res) => {
    console.log("Anfrage kommt");
    /*
    res.json({
        hallo: hallo
    });
    
    console.log(req.body);
  docs.findOne({ docId: req.body }).then(doc => {
        console.log(doc);
        res.json({
            doc
        });
    }
    ).catch(errors => {
        console.log(errors);
        return res.status(400).json(errors);
    }
    )
*/
});