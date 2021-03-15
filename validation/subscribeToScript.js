const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.scriptId = !isEmpty(data.scriptId) ? data.scriptId : "";
  data.expLevel = !isEmpty(data.expLevel) ? data.expLevel : "";



  if (Validator.isEmpty(data.userId)) {
    errors.warning = "UserId field is required";
  }

  if (Validator.isEmpty(data.userId)) {
    errors.warning = "ScriptId field is required";
  }

  if (Validator.isEmpty(data.expLevel)) {
    errors.warning = "Deine Vorkenntnisse müssen angegeben werden.";
  }
  if (data.role=="TRAINER") {
    errors.warning = "In der Trainerrolle kannst du dich nicht ins Script einschreiben.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

