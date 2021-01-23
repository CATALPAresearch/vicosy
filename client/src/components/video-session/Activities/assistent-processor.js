const {isActive} = require("../../../socket-handlers/api")

// base class for assitent processor for backend Messages
module.exports = class AssistentProcessor {
    constructor(sessionId, userId) {
        var interval = setInterval(function () { sendActiveMessage(sessionId, userId); }, 3000);
        var timeOut = setTimeout(function () {
            clearInterval(interval);
            console.log("not active");
        }, 2000);
        window.addEventListener('mousemove',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, 3000);
                if (!interval)
                    interval = setInterval(function () { sendActiveMessage(sessionId, userId); }, 3000);


            })
        window.addEventListener('onkeypress',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, 3000);
                if (!interval)
                    interval = setInterval(function () { sendActiveMessage(sessionId, userId); }, 3000);

            })


    }


}
function sendActiveMessage(sessionId, userId) {
    isActive();

}

