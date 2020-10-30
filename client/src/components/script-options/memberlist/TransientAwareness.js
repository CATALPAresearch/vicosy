import React, { Component } from "react";

export default class TransientAwareness extends Component {
  render() {
    const { transientAwareness } = this.props.roomData;
    const { clientId } = this.props;

    var awarenessInfo = null;
    if (transientAwareness && clientId in transientAwareness) {
      const clientAwarenessData = transientAwareness[clientId];
      const awarenessKeys = Object.keys(transientAwareness[clientId]);
      awarenessInfo = awarenessKeys.map(key => {
        if (key !== "nick" && clientAwarenessData[key] === true)
          return (
            <span
              className="badge badge-primary badge-pill ml-2 alpha-pulse"
              id={key}
              key={key}
            >
              {" "}
              {key}
            </span>
          );
        else return null;
      });
    }
    return <span>{awarenessInfo}</span>;
  }
}
