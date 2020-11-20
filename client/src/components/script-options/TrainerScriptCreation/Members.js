import React, { Component } from "react";
import { connect, useStore } from "react-redux";
import { LOG } from "../../logic-controls/logEvents";
import RoomComponent from "../../controls/RoomComponent";
import Logger from "../../logic-controls/Logger";
import MemberList from "../memberlist/MemberList";
import MemberListItemDefault from "../memberlist/MemberListItemDefault";
import { getScriptMembers, updateScript, getScriptById, mixGroups } from "../../../actions/scriptActions"
import Groups from "./Groups";
var QRCode = require('qrcode')

// requires a parent with non static (e.g. relative position)
export class Members extends Component {
    constructor(props) {
        super(props);
        this._id = props._id;
        this.state =
        {
            url: "",
            scriptUrl: false
        }
        this.myRef = React.createRef();


    }

    componentDidMount() {
        this.showUrl();
    }
    showUrl() {
        let urlprocessed = "";
        let url = window.location.href.replace(window.location.pathname, "")
        if (url.charAt(url.length - 1) == "#")
            url = url.substring(0, url.length - 1);
        if (url.includes("?")) {
            let parts = url.split("?");

            urlprocessed = parts[0];

        }
        else urlprocessed = url;

        this.setState({ scriptUrl: urlprocessed + "/subcribeToScript/" + this.props.script._id });
        this.setState({ showUrl: true });

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
        this.showUrl();
    }
    generateQrCode() {
        QRCode.toCanvas(this.myRef.current, this.state.scriptUrl, { scale: 8 }, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }
    render() {
        return (
            <div className="row">
                <div className="col border bg-light">
                    <h4>Teilnehmer</h4>
                    <br></br>
                    <button type="button" onClick={this.generateQrCode.bind(this)} className="btn btn-info btn-lg" data-toggle="modal" data-target="#exampleModal">
                        Einladen
                    </button>


                    <div className="modal" id="exampleModal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Verschicke den Link an alle Teilnehmer</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {this.state.scriptUrl ?
                                        <a href={this.state.scriptUrl}>{this.state.scriptUrl}</a> : null
                                    }
                                    <canvas ref={this.myRef} ></canvas>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <Logger roomId="memberlist" />
                    <RoomComponent
                        roomId="memberlist"
                        component={MemberList}
                        memberListItemComponent={MemberListItemDefault}
                    />
                </div>
                <div className="col border bg-light">
                    <h4>Gruppen</h4>
                    {
                        this.props.script.participants.length >= this.props.script.groupSize ?
                            <input
                                type="button"
                                className="btn btn-info btn-lg"
                                value="Gruppieren"
                                onClick={this.onClickMix.bind(this)}
                            /> : null
                    }

                    {

                        this.showGroups() ?
                            <Groups
                                _id={this.props.script._id}
                            /> : null

                    }

                </div>

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

