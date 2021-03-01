require("dotenv").config();
const https = require("https");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const script = require("./routes/api/script");
const docs = require("./routes/api/docs");
const passport = require("passport");
const app = express();
const socket = require("socket.io");
const path = require("path");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const winston = require("./winston-setup");
require("./client/src/utils/extensionMethods");
const ColorHash = require("color-hash");
const Script = require("./models/Script");
const doc = require("./models/Doc");
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const ShareDB = require('sharedb');

// DB config
const db = require("./config/keys").mongoURI;

//const SharedMongoDb = require ('sharedb-mongo')(db);
/**
 * By Default Sharedb uses JSON0 OT type.
 * To Make it compatible with our quill editor.
 * We are using this npm package called rich-text
 * which is based on quill delta
 */
ShareDB.types.register(require('rich-text').type);



const shareDBServer = new ShareDB(/*SharedMongoDb*/);
const sharedConnection = shareDBServer.connect();



var colorHash = new ColorHash({ saturation: 0.5 });

const isSecure = !!keys.ssl_cert;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  res.header("Access-Control-Max-Age", 2592000); // 30 days

  next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    console.log("MongoDB connected");
    //create Script rooms


  })
  .catch(err => {
    console.log(err);
  });



// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/script", script);
app.use("/api/docs", docs);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // app.get("/PeerTeachingGuide/*", (req, res) => {
  //   console.log("get request received Peer Teaching", req.url);
  //   res.sendFile(
  //     path.resolve(
  //       __dirname,
  //       "client",
  //       "build",
  //       "PeerTeachingGuide",
  //       "Completion.html"
  //     )
  //   );
  // });

  app.get("*", (req, res) => {
    console.log("get request received", req.url);

    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

var server;
const port = process.env.PORT || 5000;

if (isSecure) {
  const pfxContent = fs.readFileSync(keys.ssl_cert);
  console.log(pfxContent);
  const options = {
    pfx: pfxContent
  };

  server = https.createServer(options, app).listen(port, function () {
    winston.info(`SSL secured server listening on port ${port}`);
  });
} else {
  server = app.listen(port, (req, res) =>
    winston.info("SSL secured server listening on port " + port)
  );
}

// Socket connections
const io = socket(server, { origins: "*:*", rejectUnauthorized: false });
io.origins("*:*");

const handleSocketEvents = require("./socket-handlers/lobby-socket-events");
const DbSocket = require("./socket-handlers/db-socket-events");

//const setSocket = require("./routes/api/script");
//set socket to script.js


// auth
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  console.log("token", token);
  if (!token) return next(new Error("authentication error"));

  jwt.verify(token, keys.secretOrKey, function (err, decoded) {
    if (err) {
      // TODO: let client know?
      console.log("authentication error", err);
      return next(new Error("authentication error"));
    }

    console.log("authenticated", decoded);

    var nickName = decoded.name;
    // guest account
    if (decoded.id === "5b9e73d366ab5a3014908242") {
      nickName = "Guest" + Math.floor(Math.random() * Math.floor(9999));
    }

    socket.authData = decoded;
    socket.nick = nickName;
    // socket.color = colorHash.hex(socket.id + nickName);
    socket.color = colorHash.hex(nickName);
    return next();
  });
});

var sessionsInitialized = false;
io.on("connection", clientSocket => {
  console.log("made socket connection");

  clientSocket.on("subscribeToTimer", interval => {
    console.log("client is subscribing to timer with interval ", interval);
    setInterval(() => {
      clientSocket.emit("timer", new Date());
    }, interval);
  });

  //handleSocketEvents(clientSocket, io);

  const obj = new handleSocketEvents(clientSocket, io);
  if (!sessionsInitialized) {

    obj.initSessions(() => { sessionsInitialized = true; });
  }


  //init sessions

  DbSocket.setSocket(clientSocket, io);





});


//initializing sessions
// server-side
/*
io.use((socket, next) => {
  const obj = new handleSocketEvents(socket, io);
  obj.initSessions();
  const err = new Error("not authorized");
  err.data = { content: "Please retry later" }; // additional details
  next(err);
});
*/


// p2p signaling
var channels = {};

io.of("/p2p").on("connection", socket => {
  console.log("someone connected p2p");

  var initiatorChannel = "";

  socket.on("new-channel", function (data) {
    const unavailable = !channels[data.channel];
    if (unavailable) {
      initiatorChannel = data.channel;
    }

    channels[data.channel] = data.channel;

    if (unavailable) onNewNamespace(data.channel);
  });

  socket.on("presence", function (channel) {
    var isChannelPresent = !!channels[channel];
    socket.emit("presence", isChannelPresent);
  });

  socket.on("disconnect", function (channel) {
    if (initiatorChannel) {
      delete channels[initiatorChannel];
    }
  });
});

function onNewNamespace(channel) {
  console.log("someone created channel", channel, io.isConnected);

  const channelNamespace = io
    .of("/p2p/" + channel)
    .on("connection", function (socket) {
      socket.emit("connect", true);
      console.log(
        "someone connected to channel",
        channel,
        socket.handshake.query.audio,
        socket.handshake.query.video
      );

      channelNamespace.getAdd("mediaConfig")[socket.id] = {
        audio: socket.handshake.query.audio,
        video: socket.handshake.query.video
      };

      const clients = Object.keys(channelNamespace.connected);
      if (clients.length > 1)
        channelNamespace.emit("both-connected", channelNamespace.mediaConfig);

      socket.on("message", function (data) {
        socket.broadcast.emit("message", data.data);
      });

      socket.on("disconnect", function () {
        // todo: overwork user left broadcast
        // socket.broadcast.emit("user-left", username);

        // if one disconnects remove the other
        const clients = Object.keys(channelNamespace.connected);
        clients.forEach(clientId => {
          channelNamespace.connected[clientId].disconnect();
        });
        channelNamespace.removeAllListeners();
        delete io.nsps["/p2p/" + channel];
        console.log("deleted p2p channel", "/p2p/" + channel);
      });
    });
}


