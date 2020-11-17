import React, { Component } from "react";
import { connect, useStore } from "react-redux";
import { LOG } from "../../logic-controls/logEvents";
import RoomComponent from "../../controls/RoomComponent";
import Logger from "../../logic-controls/Logger";
import MemberList from "../memberlist/MemberList";
import MemberListItemDefault from "../memberlist/MemberListItemDefault";
import { getScriptMembers, updateScript, getScriptById, mixGroups } from "../../../actions/scriptActions"
import Groups from "../Groups";

// requires a parent with non static (e.g. relative position)
export class Members extends Component {
    constructor(props) {
        super(props);
        this._id = props._id;
        this.state =
            { url: "" }

    }

    onClickMix(e) {
        this.props.mixGroups(this.props.script.groupMix, this.props.script.participants, this.props.script.groupSize);

    }
    showGroups() {
        if (this.props.script.groups && this.props.script.groups.length > 0)
            return true;
        else return false;
    }
    showLink = () => {
        this.setState({
            showUrl: true
        })
    }

    hideLink = () => {
        this.setState({
            showUrl: false
        })
    }

    onShareSession() {
        this.props.showUrl();
    }
    render() {
        return (
            <div>
                <a
                    href="#"
                    onClick={this.onShareSession.bind(this)}
                    className="nav-link"
                >
                    Teilnehmer einladen<i className="fa fa-share-alt-square" />
                </a>
                <p>{this.state.url}</p>

                <Logger roomId="memberlist" />
                <RoomComponent
                    roomId="memberlist"
                    component={MemberList}
                    memberListItemComponent={MemberListItemDefault}
                />
                <input
                    type="button"
                    className="btn btn-info btn-lg"
                    value="Gruppieren"
                    onClick={this.onClickMix.bind(this)}
                />
                {console.log(this.props.script.groups)}
                {

                    this.showGroups() ?
                        <Groups
                            _id={this.props.script._id}
                        /> : null

                }



            </div>
        );

    }
}


const mapStateToProps = state => ({
    rooms: state.rooms,
    auth: state.auth,
    script: state.script,
    errors: state.errors,
    var: state
});




export default connect(
    mapStateToProps,
    { getScriptById, mixGroups },
    null
)(Members);

