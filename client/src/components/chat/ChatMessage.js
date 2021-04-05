import React, { Component } from "react";
import ClientName from "../controls/ClientName";
import PropTypes from "prop-types";
import { ownSocketId } from "../../socket-handlers/api";

import {
  MESSAGE_SYNCHACTION,
  MESSAGE_JOINLEAVE,
  MESSAGE_LOG,
  CHAT_DEFAULT
} from "../../shared_constants/systemChatMessageTypes";
import TimeButton from "../controls/TimeButton";

export default class ChatMessage extends Component {
  render() {
    console.log(this.props);
    const { message } = this.props;

    var messageContent;
    var additionalListClasses = "";

    switch (message.type) {
      case MESSAGE_SYNCHACTION:
        messageContent = (
          <span className="font-italic small">
            <TimeButton
              secs={message.message.time}
              faIcon={
                message.message.mediaAction === "play"
                  ? "fa-play-circle"
                  : "fa-pause-circle"
              }
            />
          </span>
        );
        break;
      case MESSAGE_LOG:
        var payload = message.message;
        if (payload.class) additionalListClasses = `bg-${payload.class}`;
        else additionalListClasses = "bg-secondary";

        messageContent = (
          <span className="font-italic chat-message small">
            <i className="fa fa-exclamation-triangle" /> {payload.message}
          </span>
        );
        break;
      case CHAT_DEFAULT:
        messageContent = (
          <span className="font-weight-light chat-message small">
            {message.message}
          </span>
        );
        break;
      default:
        messageContent = (
          <span className="font-italic chat-message small">
            {message.message}
          </span>
        );
        break;
    }

    const senderContent = message.nick ? (
      <div>
        <ClientName color={message.color} nickName={message.sender === ownSocketId() ? "Du" : message.nick} />{" "}
      </div>
    ) : null;

    return (
      // <li key={message.timestamp} className="list-group-item">
      <li
        key={message.timestamp}
        className={`list-group-item chat-message-wrapper ${additionalListClasses}`}
        style={{ padding: 2 }}
      >
        {senderContent}
        <span style={{ marginLeft: 10, paddingTop: 0 }}>
          {messageContent}
        </span>
      </li>
    );
  }
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired
};
