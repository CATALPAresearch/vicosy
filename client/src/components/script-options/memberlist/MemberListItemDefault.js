import React, { Component } from "react";
import { ownSocketId } from "../../../socket-handlers/api";
import classnames from "classnames";
import TransientAwareness from "./TransientAwareness";
import ClientName from "../../controls/ClientName";

export default class MemberListItemDefault extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const clientId = this.props.clientId;

    return (
      <li value={clientId}
        key={clientId + "key"}
        className={classnames(
          "list-group-item user-list-item d-flex align-items-center")}
      >
        {this.props.name ? this.props.name : this.props._id} ({this.props.expLevel})
      </li>
    );
  }
}
