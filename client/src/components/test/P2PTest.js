import React, { Component } from "react";
import Peer from "simple-peer";
import getUserMedia from "getusermedia";
import Chat from "../chat/Chat";
import RoomComponent from "../controls/RoomComponent";

export default class P2PTest extends Component {
  constructor(props) {
    super(props);

    this.otherJoinerIdRef = React.createRef();
    this.otherInitiatorIdRef = React.createRef();
    this.messageRef = React.createRef();
    this.videoOtherRef = React.createRef();
    this.videoOwnRef = React.createRef();

    this.ownStream = null;
    this.initiatorPeer = null;
    this.joinerPeer = null;

    this.state = {
      ownInitiatorPeerId: "",
      ownJoinerPeerId: ""
    };
  }

  componentDidMount() {
    console.log(this.props.match.path === "/testInit");

    // if (this.props.match.path !== "/testInit") this.createPeer(null);
  }

  componentWillUnmount() {
    if (this.initiatorPeer) this.initiatorPeer.destroy();
    if (this.joinerPeer) this.joinerPeer.destroy();

    if (this.ownStream)
      this.ownStream.getTracks().forEach(track => track.stop());
  }

  // TODO: streamen als initiator geht (receiver kein stream)
  // versuche 2 Connections 1 Initiator für outstream, 1 joiner für instream
  createPeer(initiator) {
    const targetStream = initiator ? this.ownStream : null;

    console.log("is initiator", initiator, targetStream);
    const isInitiator = this.props.match.path === "/testInit";
    const newPeer = new Peer({
      initiator: initiator,
      trickle: false,
      stream: targetStream,

      offerConstraints: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
        }
      },
      answerConstraints: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
        }
      },
      reconnectTimer: 30000,
      iceTransportPolicy: "relay",
      config: {
        iceServers: [
          {
            urls: [
              "stun:webrtcweb.com:7788", // coTURN
              "stun:webrtcweb.com:7788?transport=udp" // coTURN
            ],
            username: "muazkh",
            credential: "muazkh"
          },
          {
            urls: [
              "turn:webrtcweb.com:7788", // coTURN 7788+8877
              "turn:webrtcweb.com:4455?transport=udp", // restund udp

              "turn:webrtcweb.com:8877?transport=udp", // coTURN udp
              "turn:webrtcweb.com:8877?transport=tcp" // coTURN tcp
            ],
            username: "muazkh",
            credential: "muazkh"
          },
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun.l.google.com:19302?transport=udp"
            ]
          }
          // {
          //   urls: "stun:numb.viagenie.ca",
          //   username: "comet07@gmx.de",
          //   credential: "willrein"
          // },
          // {
          //   urls: "turn:numb.viagenie.ca",
          //   username: "comet07@gmx.de",
          //   credential: "willrein"
          // }
        ]
      }
    });

    if (initiator) this.initiatorPeer = newPeer;
    else this.joinerPeer = newPeer;

    newPeer.on("signal", data => {
      if (initiator)
        this.setState({ ownInitiatorPeerId: JSON.stringify(data) });
      else this.setState({ ownJoinerPeerId: JSON.stringify(data) });

      console.log("Signal received, renegotiate", "renegotiate" in data);

      //if ("renegotiate" in data) this.peer.negotiate();
    });

    newPeer.on("data", data => {
      console.log("received message", data);
    });

    newPeer.on("connect", () => {
      console.log("PEER CONNECTED");
    });

    if (!initiator) {
      newPeer.on("stream", stream => {
        console.log("stream received");

        this.videoOtherRef.current.srcObject = stream;
        this.videoOtherRef.current.play();
      });
    }
  }

  connect(toJoiner) {
    var otherId = toJoiner
      ? JSON.parse(this.otherJoinerIdRef.current.value)
      : JSON.parse(this.otherInitiatorIdRef.current.value);

    const targetPeer = toJoiner ? this.initiatorPeer : this.joinerPeer;
    targetPeer.signal(otherId);
  }

  send() {
    // const targetPeer = toJoiner ? this.initiatorPeer : this.joinerPeer;
    // this.peer.send(this.messageRef.current.value);
  }

  streamVideo() {
    getUserMedia({ video: true, audio: false }, (err, stream) => {
      if (err) return console.error(err);
      // this.peer.addStream(stream);
      this.ownStream = stream;

      this.videoOwnRef.current.srcObject = stream;
      this.videoOwnRef.current.play();

      if (this.initiatorPeer) this.initiatorPeer.addStream(this.ownStream);
      // this.createPeer(stream);
    });
  }

  render() {
    return (
      <div>
        <h1>P2P Initiator</h1>
        <label>Your Initiator ID:</label>
        <br />
        <textarea id="yourId" value={this.state.ownInitiatorPeerId} />
        <br />
        <label>Other Joiner ID:</label>
        <br />
        <textarea ref={this.otherJoinerIdRef} id="otherId" />
        <button onClick={this.connect.bind(this, true)} id="connect">
          connect
        </button>
        <br />

        {/* <label>Enter Message:</label>
        <br />
        <textarea ref={this.messageRef} id="yourMessage" />
        <button onClick={this.send.bind(this)} id="send">
          send
        </button> */}
        <button onClick={this.streamVideo.bind(this)} id="stream">
          activate video
        </button>
        <button onClick={this.createPeer.bind(this, true)} id="peer">
          activate initiator peer
        </button>
        <pre id="messages" />
        <video ref={this.videoOwnRef} autoPlay controls />

        <hr />
        <h1>P2P Joiner</h1>
        <label>Your Joiner ID:</label>
        <br />
        <textarea id="yourId" value={this.state.ownJoinerPeerId} />
        <br />
        <label>Other Initiator ID:</label>
        <br />
        <textarea ref={this.otherInitiatorIdRef} id="otherId" />
        <button onClick={this.connect.bind(this, false)} id="connect">
          connect
        </button>
        <br />
        <button onClick={this.createPeer.bind(this, false)} id="peer">
          activate joiner peer
        </button>
        <video ref={this.videoOtherRef} autoPlay controls />

        <RoomComponent roomId="lobby" component={Chat} />
      </div>
    );
  }
}
