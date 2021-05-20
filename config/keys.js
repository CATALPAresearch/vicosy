module.exports = require("./keys_dev");
module.exports = require("./ssl_cert");
module.exports = require("./secretorkey");
module.exports = require("./mongouri.js");
/*mongouri
if (process.env.NODE_ENV === "production") {
  
  module.exports = require("./keys_prod");
} else {
  module.exports = require("./keys_dev");
}*/
