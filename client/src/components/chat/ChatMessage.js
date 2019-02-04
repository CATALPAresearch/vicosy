import React, { Component } from "react";
import ClientName from "../controls/ClientName";
import PropTypes from "prop-types";
import {
  MESSAGE_SYNCHACTION,
  MESSAGE_JOINLEAVE,
  MESSAGE_LOG
} from "../../shared_constants/systemChatMessageTypes";
import TimeButton from "../controls/TimeButton";

export default class ChatMessage extends Component {
  render() {
    const { message } = this.props;

    var messageContent;
    var additionalListClasses = "";

    switch (message.type) {
      case MESSAGE_SYNCHACTION:
        messageContent = (
          <span className="font-weight-light">
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
          <span className="font-weight-light chat-message">
            <i className="fa fa-exclamation-triangle" /> {payload.message}
          </span>
        );
        break;
      default:
        messageContent = (
          <span className="font-weight-light chat-message">
            {message.message}
          </span>
        );
        break;
    }

    const senderContent = message.nick ? (
      <span>
        <ClientName color={message.color} nickName={message.nick} />{" "}
      </span>
    ) : null;

    return (
      // <li key={message.timestamp} className="list-group-item">
      <li
        key={message.timestamp}
        className={`list-group-item chat-message-wrapper ${additionalListClasses}`}
      >
        {senderContent}
        {messageContent}
      </li>
    );
  }
}

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired
};
