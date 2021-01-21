// base class for assitent processor for backend Messages
module.exports = class AssistentProcessor {
    constructor() {
        console.log("Hallo");
    }


    unsetVideoAnnotation() {
        console.log("Video annotation set");
    }
    setVideoAnnotation() {
        console.log("Video annotation set");
    }
    sentChatMessage() {
        console.log("Chat message sent");

    }
    joinsRoom(socketIO, clientSocket, roomId) {
        console.log("Joins room");

    }
    createTrainerSession(script, group) {
        console.log("createTrainerSession");

    }

}

