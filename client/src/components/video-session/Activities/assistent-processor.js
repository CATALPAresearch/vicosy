import React, { Component } from "react";
import { connect } from "react-redux";
import { sendActiveMessage, setIncominginstruction, sendTabLostMessage } from "../../../actions/assistentActions";
import { ownSocketId } from "../../../socket-handlers/api";
import Instruction from "../../Assistent/phases/Instruction";
import { TIME_UPDATE } from "../AbstractVideoEvents";
const assistentConfig = require ("../../../shared_constants/assistent");
const { listenActiveMessage, listenTabLostMessage } = require("../../../socket-handlers/api")



// base class for assitent processor for backend Messages
export class AssistentProcessor extends Component {

    constructor(props) {
        super(props);
        this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
        this.sessionId = this.props.roomId;
        this.sendActiveMessage = this.sendActiveMessage.bind(this);
        this.state = { partnerActive: true, partner: null };
        this.sendActiveMessageInterval = assistentConfig.inactive_report_interval;
        this.checkActiveMessageInterval = assistentConfig.inactive_check_interval;
        
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


        this.interval = setInterval(this.sendActiveMessage, this.sendActiveMessageInterval);
        this.timeOut = setTimeout(() => {
            clearInterval(this.interval);
            console.log("not active");
        }, this.sendActiveMessageInterval);


        //Listener for Events that will be send to partner(s)

        window.addEventListener('blur',
            this.sendTabLostMessage.bind(this)

        );
        window.addEventListener('mousemove',
            this.testFunction.bind(this)
        )
        window.addEventListener('onkeypress',
            this.testFunction.bind(this)
        )

    }

    testFunction() {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            clearInterval(this.interval);
            this.interval = false;
            console.log("not active");
        }, this.sendActiveMessageInterval);
        if (!this.interval)
            this.interval = setInterval(this.sendActiveMessage, this.sendActiveMessageInterval);



    }

    componentWillUnmount() {
        window.removeEventListener('blur',
            this.sendTabLostMessage.bind(this)
        );
        window.removeEventListener('mousemove',
            this.testFunction.bind(this)
        )
        window.removeEventListener('onkeypress',
            this.testFunction.bind(this)
        )
        clearTimeout(this.timeOut);
        clearInterval(this.interval);


    }

    resetTimer(partnerName) {
        this.partner = partnerName;
        clearTimeout(this.resetTimerVar);

        this.resetTimerVar = setTimeout(this.showMessage.bind(this), this.checkActiveMessageInterval);


    }
    showMessage() {
        if (this.partner)
            this.props.setIncominginstruction(new Instruction("Dein Partner " + this.partner + " ist seit über " + this.checkActiveMessageInterval / 1000 + " Sekunden inaktiv. Tritt mit ihm in Kontakt.", ""))
        else
            this.props.setIncominginstruction(new Instruction("Dein Partner ist aktuell nicht in der Sitzung.", ""))

    }

    sendTabLostMessage() {
        if (this.sessionId)
            if (this.props.rooms.rooms[this.sessionId])
                this.props.sendTabLostMessage(this.sessionId, this.props.auth.user.name, ownSocketId(), this.props.rooms.rooms[this.sessionId].state.sharedRoomData.clients);
    }

    sendActiveMessage() {
        if (this.sessionId)
            if (this.props.rooms.rooms[this.sessionId])
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

