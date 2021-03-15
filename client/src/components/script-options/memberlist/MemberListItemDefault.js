import React, { Component } from "react";
import classnames from "classnames";
export default class MemberListItemDefault extends Component {
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
