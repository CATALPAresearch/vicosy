import React, { Component } from "react";
import { connect } from "react-redux";
const { isActive, listenActiveMessage } = require("../../../socket-handlers/api")


// base class for assitent processor for backend Messages
export class AssistentProcessor extends Component {

    constructor(props) {
        super(props);
        this.sessionId = this.props.sessionId;
        this.userId = this.props.userId;
        this.clients = this.props.clients;
        this.userName = this.props.userName;

        listenActiveMessage(this.sessionId, result => console.log("Action alive"));
        var interval = setInterval(function () { sendActiveMessage(this.sessionId, this.userId, this.userName, this.clients); }, 3000);
        var timeOut = setTimeout(function () {
            clearInterval(interval);
            console.log("not active");
        }, 2000);
        window.addEventListener('mousemove',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, 3000);
                if (!interval)
                    interval = setInterval(function () { sendActiveMessage(this.sessionId, this.userId, this.userName, this.clients); }, 3000);


            })
        window.addEventListener('onkeypress',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, 3000);
                if (!interval)
                    interval = setInterval(function () { sendActiveMessage(this.sessionId, this.userId, this.userName, this.clients); }, 3000);

            })
        function sendActiveMessage(sessionId, userId, userName, clients) {
            alert(sessionId);
            isActive(sessionId, userId, userName, clients);

        }
    }




    render() {
        return null;
    }



}


const mapStateToProps = state => ({
    localState: state.localState,
    auth: state.auth,
    script: state.script
});

export default connect(
    mapStateToProps
)(AssistentProcessor);

