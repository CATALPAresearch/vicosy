const fs = require("fs");
module.exports = {
    key : fs.readFileSync("/usr/local/psa/var/modules/letsencrypt/etc/live/charming-payne.46-163-74-68.plesk.page/privkey.pem"), 
    cert: fs.readFileSync("/usr/local/psa/var/modules/letsencrypt/etc/live/charming-payne.46-163-74-68.plesk.page/cert.pem")
};
  