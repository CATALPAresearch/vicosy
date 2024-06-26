const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateScriptInput(data) {
  let errors = {};
  data.scriptName = !isEmpty(data.scriptName) ? data.scriptName : "";
  data.scriptType = !isEmpty(data.scriptType) ? data.scriptType : "";
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.videourl = !isEmpty(data.videourl) ? data.videourl : "";
  data.groupMix = !isEmpty(data.groupMix) ? data.groupMix : "";
  data.groupSize = !isEmpty(data.groupSize) ? data.groupSize : "";
  data.themes = !isEmpty(data.themes) ? data.themes : "";
  data.isPhase0 = !isEmpty(data.isPhase0) ? data.isPhase0 : "";
  data.isPhase5 = !isEmpty(data.isPhase5) ? data.isPhase5 : "";
  data.phase0Assignment = !isEmpty(data.phase0Assignment) ? data.phase0Assignment : "";
  data.phase5Assignment = !isEmpty(data.phase5Assignment) ? data.phase5Assignment : "";


  if (Validator.isEmpty(data.scriptName)) {
    errors.scriptName = "Das Script muss einen Namen haben";
  }


  if (!Validator.isLength(data.scriptName, { min: 2, max: 40 })) {
    errors.scriptName = "Name muss von 2 bis 40 Zeichen haben";
  }
  if (Validator.isEmpty(data.scriptType)) {
    errors.scriptType = "Scripttype field is required";
  }

  if (Validator.isEmpty(data.userId)) {
    errors.userId = "UserId is required";
  }

  if (Validator.isEmpty(data.videourl)) {
    errors.videourl = "Url eines Videos muss angegeben werden";
  }
  if (Validator.isEmpty(data.groupMix)) {
    errors.groupMix = "groupMix field is required";
  }

  if (Validator.isEmpty(data.groupSize.toString())) {
    errors.groupSize = "groupSize field is required";
  }

  if (Validator.isEmpty(data.isPhase0.toString())) {
    errors.isPhase0 = "phase0 field is required";
  }

  if (Validator.isInt(data.isPhase0.toString())) {
    errors.isPhase0 = "phase0 must be an integer";
  }

  if (Validator.isEmpty(data.isPhase5.toString())) {
    errors.isPhase0 = "phase5 field is required";
  }

  if (Validator.isInt(data.isPhase5.toString())) {
    errors.isPhase0 = "phase5 must be an integer";
  }



  if (Validator.isEmpty(data.themes)) {
    errors.themes = "Es muss eine Frage angegeben werden.";
  }


  if (!Validator.isInt(data.groupSize.toString())) {
    errors.groupSize = "GroupSize ist not an integer";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
