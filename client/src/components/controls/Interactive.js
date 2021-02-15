import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { LOG_ERROR } from "../logic-controls/logEvents";

/**
 * Component that prevents user interaction with interactable child UI-components
 * Example usecase: disable feature for scripted peer teaching.
 * Provide a disabledMessage to communicate reason why component is disabled.
 */
export default class Interactive extends Component {
  onClick = e => {
    if (!this.props.disabledMessage) return;

    window.logEvents.dispatch(LOG_ERROR, {
      message: `${this.props.disabledMessage}`
    });
  };

  render() {
    if (!this.props.disabled) return this.props.children;

    return (
      <div onClick={this.onClick}>
        <div className="grey-out prevent-pointer">{this.props.children}</div>
      </div>
    );
  }
}

Interactive.propTypes = {
  content: PropTypes.object,
  disabled: PropTypes.bool,
  disabledMessage: PropTypes.string
};
