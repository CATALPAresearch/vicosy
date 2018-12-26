// deprecated


import { PEER_SIGNAL_MESSAGE } from "./p2pEvents";
import { sendPeerSignalMessage } from "../socket-handlers/api";
import Peer from "simple-peer";
import { registerStream, unregisterStream } from "../stream-model/StreamModel";

export default class P2PConnection {
  constructor(roomId, clientId) {
    this.setState("uninitialized"); // p2p-handshake, established, declined, closed, error
    this.handShakeState = "";
    this.roomId = roomId;
    this.otherClientId = clientId;

    this.peerObject;
    this.peerConnectionId;
    this.initiator;

    this.streamToApply;

    this.onPeerSignalMessage = this.onPeerSignalMessage.bind(this);

    this.listenToConnectionRequests();
  }

  /**
   * public
   */

  dispose() {
    if (this.peerObject) this.peerObject.destroy();

    // this will clear a received stream
    unregisterStream(this.roomId, this.clientId);

    this.streamToApply = null;
    window.p2pEvents.remove(PEER_SIGNAL_MESSAGE, this.onPeerSignalMessage);
    this.closed = true;
  }

  applyOwnStream(stream) {
    this.removeOwnAppliedStream();

    if (this.peerObject) this.peerObject.addStream(stream);

    this.streamToApply = stream;
  }

  removeOwnAppliedStream() {
    if (this.peerObject && this.streamToApply)
      this.peerObject.removeStream(this.streamToApply);

    this.streamToApply = null;
  }

  /**
   * private
   */

  listenToConnectionRequests() {
    window.p2pEvents.add(PEER_SIGNAL_MESSAGE, this.onPeerSignalMessage);
  }

  onPeerSignalMessage(otherClientId, roomId, message) {
    console.log(
      "received signal peer message",
      otherClientId,
      roomId,
      message,
      this.otherClientId,
      this.roomId
    );
    if (otherClientId !== this.otherClientId || roomId !== this.roomId) return;

    const { type } = message;

    switch (type) {
      case "connect-p2p-request": // I was asked to be initiator or decline a p2p connection & to send my peerId
        this.handleConnectionRequest();
        break;
      case "connect-p2p-answer": // I got the answer of my connection request, preparing to join & send my peerId
        this.handleConnectionAnswer(message);
        break;
      case "connect-p2p-answer-ack": // The requester created a join peer and sent me his peer id
        this.handleConnectionAnswerAck(message);
        break;
    }
  }

  handleConnectionRequest() {
    if (this.state !== "uninitialized") return;

    if (!this.peerObject) {
      this.peerObject = new Peer({
        initiator: true,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: "relay",
        config: {
          iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "comet07@gmx.de",
              credential: "willrein"
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "comet07@gmx.de",
              credential: "willrein"
            }
          ]
        }
      });

      this.initiator = true;

      this.peerObject.on("signal", peerId => {
        this.peerId = peerId;
        this.emitInitiatorPeerId();
        console.log("received offer signal, my initiator peer id", peerId);
      });

      this.registerGenericPeerEvents();
    } else if (this.peerId) {
      this.emitInitiatorPeerId();
    } else {
      this.setState("p2p-handshake", "pending-own-peerId");
    }
  }

  emitInitiatorPeerId() {
    sendPeerSignalMessage(
      this.roomId,
      { type: "connect-p2p-answer", peerId: this.peerId },
      this.otherClientId
    );

    this.setState("p2p-handshake", "emitted-own-peerId-waiting-ack");
  }

  handleConnectionAnswer(message) {
    if (this.state !== "p2p-handshake") return;

    console.log("handle answer", this.peerObject);

    if (!this.peerObject) {
      this.peerObject = new Peer({
        initiator: false,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: "relay",
        config: {
          iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "comet07@gmx.de",
              credential: "willrein"
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "comet07@gmx.de",
              credential: "willrein"
            }
          ]
        }
      });

      this.initiator = false;

      this.peerObject.on("signal", peerId => {
        this.peerId = peerId;
        this.emitJoinerPeerId();
        console.log("received answer signal, my joiner peer id", peerId);
      });

      this.registerGenericPeerEvents();
      this.peerObject.signal(message.peerId);
    } else if (this.peerId) {
      this.emitJoinerPeerId();
    } else {
      this.setState(
        "p2p-handshake",
        "received-others-peerId-pending-own-peerId"
      );
    }
  }

  emitJoinerPeerId() {
    sendPeerSignalMessage(
      this.roomId,
      { type: "connect-p2p-answer-ack", peerId: this.peerId },
      this.otherClientId
    );

    this.setState("p2p-handshake", "emitted-own-peerId-wait-established");
  }

  handleConnectionAnswerAck(message) {
    if (this.peerObject) this.peerObject.signal(message.peerId);

    this.setState("p2p-handshake", "received-others-peerId-wait-established");
  }

  registerGenericPeerEvents() {
    if (this.streamToApply) this.peerObject.addStream(this.streamToApply);

    this.peerObject.on("error", err => {
      console.error(err, err.code);
      this.setState("error", err.code);
    });

    this.peerObject.on("connect", () => {
      this.setState("established", "done");
    });

    this.peerObject.on("data", data => {
      console.log("data via p2p channel", data);
    });

    // todo: stream removed?
    this.peerObject.on("stream", stream => {
      console.log("stream detected, register", stream);

      registerStream(this.roomId, this.clientId, stream);
    });
  }

  requestConnection() {
    console.log("requesting connection", this.state);

    if (this.state === "uninitialized") {
      sendPeerSignalMessage(
        this.roomId,
        { type: "connect-p2p-request" },
        this.otherClientId
      );
      this.setState("p2p-handshake", "wait-connection-request-answer");
    }
  }

  setState(state, substate = "") {
    this.state = state;

    if (substate) this.substate = substate;

    console.log("P2P Connection state", state, substate);
  }
}
