import React, { Component } from "react";
import GroupMemberList from "../memberlist/GroupMemberList";
import { connect } from "react-redux";

// requires a parent with non static (e.g. relative position)
export class Groups extends Component {
    constructor(props) {
        super(props);
        this._id = props._id;
        this.state =
            { url: "" }

    }
    // shows URL/QR-Code
    showLink = () => {
        this.setState({
            showUrl: true
        })
    }

    // hides URL/QR-Code
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
