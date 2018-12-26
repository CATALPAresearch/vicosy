import React, { Component } from "react";
import ClientName from "../controls/ClientName";
import PropTypes from "prop-types";
import {
  MESSAGE_SYNCHACTION,
  MESSAGE_JOINLEAVE,
  MESSAGE_LOG
} from "../../shared_constants/systemChatMessageTypes";
import classnames from "classnames";
import { SEEK_REQUEST } from "../video-session/PlayBackUiEvents";
import TimeDisplay from "../controls/TimeDisplay";

export default class ChatMessage extends Component {
  onTimeActionClick(messageData) {
    console.log("jump to", messageData);
    window.sessionEvents.dispatch(SEEK_REQUEST, messageData.time);
  }

  render() {
    const { message } = this.props;

    var messageContent;
    var additionalListClasses = "";

    switch (message.type) {
      case MESSAGE_SYNCHACTION:
        // const date = new Date(null);
        // date.setSeconds(message.message.time); // specify value for SECONDS here
        // const timeString = date.toISOString().substr(11, 8);
        messageContent = (
          <span className="font-weight-light">
            <button
              onClick={this.onTimeActionClick.bind(this, message.message)}
              type="button"
              className="btn btn-outline-dark"
            >
              <i
                className={classnames("fa mr-1", {
                  "fa-play-circle": message.message.mediaAction === "play",
                  "fa-pause-circle": message.message.mediaAction === "pause"
                })}
                style={{ color: "#007bff" }}
              />
              <TimeDisplay seconds={message.message.time} />
              {/* {timeString} */}
            </button>
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
