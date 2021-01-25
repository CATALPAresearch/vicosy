import React, { Component } from "react";
import { connect } from "react-redux";
import { sendActiveMessage} from "../../../actions/assistentActions";
import { ownSocketId } from "../../../socket-handlers/api";

const {listenActiveMessage } = require("../../../socket-handlers/api")



// base class for assitent processor for backend Messages
export class AssistentProcessor extends Component {

    constructor(props) {
        super(props);
        this.sessionId = this.props.roomId;
        this.sendActiveMessage = this.sendActiveMessage.bind(this);

        listenActiveMessage(ownSocketId(), result => {alert ("alive")});
        var interval = setInterval(this.sendActiveMessage, 3000);
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
                    interval = setInterval(this.sendActiveMessage, 3000);


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
                    interval = setInterval(this.sendActiveMessage, 3000);

            })

    }





    sendActiveMessage() {
        this.props.sendActiveMessage(this.sessionId, this.props.auth.user.name, ownSocketId(), this.props.rooms.rooms[this.sessionId].state.sharedRoomData.clients)
    }
    render() {
      //  listenActiveMessage();
        return null;
    }



}


const mapStateToProps = state => ({
    localState: state.localState,
    auth: state.auth,
    script: state.script
});

export default connect(
    mapStateToProps, { sendActiveMessage }
)(AssistentProcessor);

