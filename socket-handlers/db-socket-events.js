var socket = {};
var io = {};


exports.setSocket = function (socketIn, ioIn) {
    socket = socketIn;
    io = ioIn;
}

exports.deleteScript = function (script) {
    console.log("Socket delete");
    for (var member of script.participants) {
        console.log(member._id);
        socket.to("studentlobby").emit("removedScript"+ member._id, script._id);
    }
}