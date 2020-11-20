import React, { Component } from "react";
import { LOG } from "../../logic-controls/logEvents";
import RoomComponent from "../../controls/RoomComponent";
import Logger from "../../logic-controls/Logger";
import GroupMemberList from "../memberlist/GroupMemberList";
import MemberListItemDefault from "../memberlist/MemberListItemDefault";
import { getScriptMembers } from "../../../actions/scriptActions"
import { connect, useStore } from "react-redux";

// requires a parent with non static (e.g. relative position)
export class Groups extends Component {
    constructor(props) {
        super(props);
        this._id = props._id;
        this.state =
            { url: "" }

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
        var lists;
        var groups = Object.values(this.props.script.groups);
        if (groups) {
            lists = groups.map((group, i) => {
                return (
                    <GroupMemberList
                        group={group}
                        key={i}
                    />
                );
            });


            return (
                <div>
                    {lists}

                </div>
            );

        }
    }

}
const mapStateToProps = state => ({
    rooms: state.rooms,
    script: state.script,
});


export default connect(
    mapStateToProps,
    null
)(Groups);
