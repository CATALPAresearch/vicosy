import React, { Component } from "react";
import { ownSocketId } from "../../../socket-handlers/api";
import classnames from "classnames";
import TransientAwareness from "./TransientAwareness";
import ClientName from "../../controls/ClientName";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { deleteMemberFromScript } from "../../../actions/scriptActions"
import { connect, useStore } from "react-redux";


export class MemberListItemDefault extends Component {
  constructor(props) {
    super(props);

  }
  deleteUser(e) {

    this.props.deleteMemberFromScript(e.value, this.props.script);
  }
  render() {
    const clientId = this.props.clientId;

    return (
      <li value={clientId}
        key={clientId + "key"}
        className={classnames(
          "list-group-item user-list-item d-flex justify-content-between")}
      >
        {this.props.name ? this.props.name : this.props._id} ({this.props.expLevel})

        <FontAwesomeIcon className="float-right" value={clientId} icon={faMinusCircle} onClick={e => { this.deleteUser(clientId) }} />

      </li>
    );
  }
}


const mapStateToProps = state => ({
  script: state.script,
});



export default connect(
  mapStateToProps, {deleteMemberFromScript},
  null
)(MemberListItemDefault);

