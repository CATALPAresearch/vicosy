import React, { Component } from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { deleteMemberFromScript } from "../../../actions/scriptActions"
import { connect } from "react-redux";


export class MemberListItemDeletable extends Component {
//deletes User
  deleteUser(e) {
    this.props.deleteMemberFromScript(this.props.clientId, this.props.script);

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
        {!this.props.script.started ?
          <div className="float-right" onClick={this.deleteUser.bind(this)} ><FontAwesomeIcon className="float-right" value={clientId} icon={faMinusCircle} /></div>
          : null
        }
      </li>
    );
  }
}


const mapStateToProps = state => ({
  script: state.script,
});



export default connect(
  mapStateToProps, { deleteMemberFromScript },
  null
)(MemberListItemDeletable);

