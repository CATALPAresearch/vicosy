import React, { Component } from "react";
import { connect } from "react-redux";
import { sendActiveMessage, setIncominginstruction, sendTabLostMessage } from "../../../actions/assistentActions";
import { ownSocketId } from "../../../socket-handlers/api";
import Instruction from "../../Assistent/phases/Instruction";
import { TIME_UPDATE } from "../AbstractVideoEvents";
const { listenActiveMessage, listenTabLostMessage } = require("../../../socket-handlers/api")



// base class for assitent processor for backend Messages
export class AssistentProcessor extends Component {

    constructor(props) {
        super(props);
        this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
        this.sessionId = this.props.roomId;
        this.sendActiveMessage = this.sendActiveMessage.bind(this);
        this.state = { partnerActive: true, partner: null };
        this.sendActiveMessageInterval = 3000;
        this.checkActiveMessageInterval = 10000;
        //this.activeMessageTimeOut = setTimeout(function () { this.setState({ partnerActive: false }) }, this.checkActiveMessageInterval);
        this.activeMessageTimeOut = null;
        this.resetTimerVar = null;
        this.partner = null;
        this.resetTimer(null);
        listenActiveMessage(ownSocketId(), result => {
            this.resetTimer(result.userName);

        });
        listenTabLostMessage(ownSocketId(), result => {
          
          
         
        this.props.setIncominginstruction(new Instruction("Dein Partner " + result.userName + " hat den Tab geschlossen oder gewechselt. Kontaktiere ihn.", ""))
  

        });

       
        var interval = setInterval(this.sendActiveMessage, this.sendActiveMessageInterval);
        var timeOut = setTimeout(function () {
            clearInterval(interval);
            console.log("not active");
        }, this.sendActiveMessageInterval);


        //Listener for Events that will be send to partner(s)

        window.addEventListener('blur', (e) => {
            this.sendTabLostMessage();
            
        });
        window.addEventListener('mousemove',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, this.sendActiveMessageInterval);
                if (!interval)
                    interval = setInterval(this.sendActiveMessage, this.sendActiveMessageInterval);


            })
        window.addEventListener('onkeypress',
            e => {
                clearTimeout(timeOut);
                timeOut = setTimeout(function () {
                    clearInterval(interval);
                    interval = false;
                    console.log("not active");
                }, this.sendActiveMessageInterval);
                if (!interval)
                    interval = setInterval(this.sendActiveMessage, 3000);

            })

    }



    resetTimer(partnerName) {
        this.partner = partnerName;
        clearTimeout(this.resetTimerVar);

        this.resetTimerVar = setTimeout(this.showMessage.bind(this), this.checkActiveMessageInterval);


    }
    showMessage() {

        this.props.setIncominginstruction(new Instruction("Dein Partner " + this.partner + " ist seit über " + this.checkActiveMessageInterval / 1000 + " Sekunden inaktiv. Tritt mit ihm in Kontakt.", ""))
    }

    sendTabLostMessage() {
         this.props.sendTabLostMessage(this.sessionId, this.props.auth.user.name, ownSocketId(), this.props.rooms.rooms[this.sessionId].state.sharedRoomData.clients);
    }

    sendActiveMessage() {
        this.props.sendActiveMessage(this.sessionId, this.props.auth.user.name, ownSocketId(), this.props.rooms.rooms[this.sessionId].state.sharedRoomData.clients);
    }

    onVideoTimeUpdate() {
        this.resetTimer(this.partner);
    }
    componentDidMount() {
        window.sessionEvents.add(TIME_UPDATE, this.onVideoTimeUpdate);
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
    mapStateToProps, { sendActiveMessage, setIncominginstruction, sendTabLostMessage }
)(AssistentProcessor);

