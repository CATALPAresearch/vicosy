import React, { Component } from "react";
import {
  sendChatMessage,
  shareTransientAwareness
} from "../../socket-handlers/api";
import "./chat.css";
import ChatMessage from "./ChatMessage";
import { checkAndExecuteChatInputAction } from "./inputParser";
import InnerShadowSmall from "../layout/InnerShadowSmall";
import classnames from "classnames";
import { connect } from "react-redux";
import { setUnseenActivities } from "../../actions/localStateActions";

import HintArrow from '../Assistent/HintArrow'

// room component, please wrap with RoomComponent
class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      seenMessagesCount: 0
    };

    this.contentRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);
  }

  onSubmitClicked(e) {
    e.preventDefault();

    if (!this.state.input) return;

    if (!this.parseInput(this.state.input)) {
      sendChatMessage(this.props.roomId, this.state.input);
    }

    this.setState({ input: "" });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.roomState.roomData.state) return;

    const chatCount = nextProps.roomState.roomData.state.chat
      ? nextProps.roomState.roomData.state.chat.length
      : 0;
    const currentUnseen = nextProps.localState.unseenActivities.count;

    var nextUnseen = 0;

    if (nextProps.visible && this.state.seenMessagesCount !== chatCount) {
      this.setState({ seenMessagesCount: chatCount });
    } else if (!nextProps.visible) {
      nextUnseen = chatCount - this.state.seenMessagesCount;
    }

    if (currentUnseen !== nextUnseen) {
      this.props.setUnseenActivities(nextUnseen);
    }
  }

  // returns true if regular chatmessage
  parseInput(input) {
    return checkAndExecuteChatInputAction(input);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.input !== "" && this.state.input === "") this.setTyping(true);
    else if (nextState.input === "" && this.state.input !== "")
      this.setTyping(false);
  }

  componentWillUnmount() {
    if (this.state.input !== "") this.setTyping(false);
  }

  setTyping(value) {
    shareTransientAwareness(this.props.roomId, "typing", value, true);
  }

  scrollContentDidMount = node => {
    if (node) {
      node.addEventListener("scroll", () => console.log("scroll!"));
    }
  };

  componentDidUpdate() {
    if (this.contentRef.current) {
      this.contentRef.current.scrollTop = this.contentRef.current.scrollHeight;
    }
  }

  render() {
    const { roomAvailable, roomData } = this.props.roomState;
    var messages = null;

    // console.log("available", roomAvailable);

    if (roomAvailable && roomData) {
      // collect awarenessdata
      var typingAwareness = null;
      if (roomData.transientAwareness) {
        const typingClients = Object.keys(roomData.transientAwareness).filter(
          (clientId, index, array) => {
            if (roomData.transientAwareness[clientId].typing) return true;
            return false;
          }
        );

        const nicks = typingClients.map(clientId => {
          console.log(roomData.transientAwareness[clientId]);
          return roomData.transientAwareness[clientId].nick;
        });

        if (nicks.length > 0) typingAwareness = nicks.join() + " typing...";
      }

      if (roomData.state.chat) {
        messages = roomData.state.chat.map(message => (
          <ChatMessage
            key={message.timestamp + Math.random()}
            message={message}
          />
        ));
      }
    }

    return (
      <div
        className={classnames("chat relative", {
          "hidden-nosize": !this.props.visible
        })}
        
          >
            {this.props.assistent.actInstruction?this.props.assistent.active&&this.props.assistent.actInstruction.markers==="chat-write"?
        <HintArrow
        style= {{position: "absolute", left: 120, bottom:40}}
        direction="down"
        /> :null:null}

        <div className="chat-content relative" ref={this.contentRef}>
          <ul className="list-group message-list list-group-flush medium">
            {messages}
          </ul>
        </div>
        <small>
        {typingAwareness}
        </small>
        <form
          autoComplete="off"
          onSubmit={this.onSubmitClicked}
          className="chat-send"
          title="Hier kannst du Chatnachrichten schreiben und abschicken"
        >


          <span className="hFlexLayout"
          style={{overflow: "hidden"}}
          >
        

            <input
              autoComplete="false"
              name="hidden"
              type="text"
              style={{ display: "none" }}
            />

            <input
              className="form-control form-control-sm mr-sm-2"
              id="chat-write"
              type="text"
              name="input"
              value={this.state.input}
              onChange={this.onChange}
            />

            <button type="submit" className="btn btn-primary btn-sm">

              Send       
            
            </button>
            <span>
        
            </span>
          </span>
        </form>
        <InnerShadowSmall />
      </div>
    );
  }
}

Chat.defaultProps = {
  visible: true
};

const mapStateToProps = state => ({
  localState: state.localState,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { setUnseenActivities }
)(Chat);
