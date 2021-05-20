import React, { Component } from "react";
import { connect } from "react-redux";
import { sendActiveMessage, setIncominginstruction, sendTabLostMessage } from "../../../actions/assistentActions";
import { ownSocketId, evalLogToRoom } from "../../../socket-handlers/api";
import Instruction from "../../Assistent/phases/Instruction";
import { TIME_UPDATE } from "../AbstractVideoEvents";
import Hints from "./hints";
import EvalLogger from "../../video-session/Evaluation/EvalLogger";
import { TAB_LOST, INACTIVE } from "../../video-session/Evaluation/EvalLogEvents";
const assistentConfig = require("../../../shared_constants/assistent");
const { listenActiveMessage, listenTabLostMessage } = require("../../../socket-handlers/api")



// base class for assistent processor for backend Messages
export class ActivityOberserver extends Component {

    constructor(props) {
        super(props);
        this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
        this.sessionId = this.props.roomId;
        this.sendActiveMessage = this.sendActiveMessage.bind(this);
        this.state = { partnerActive: true, partner: null };
        this.sendActiveMessageInterval = assistentConfig.inactive_report_interval;
        this.checkActiveMessageInterval = assistentConfig.inactive_check_interval;
        this.selfInactiveInterval = assistentConfig.self_inactive_check_interval;
        this.hints = new Hints();
        this.evalLoggerRef = null;
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
            this.evalLoggerRef.logToEvaluation(this.constructor.name, TAB_LOST, "Partner");


        });


        this.interval = setInterval(this.sendActiveMessage, this.sendActiveMessageInterval);
        this.timeOut = setTimeout(() => {
            clearInterval(this.interval);
            console.log("not active");
        }, this.sendActiveMessageInterval);

        if (this.props.assistent.active)
            this.selfTimeOut = setTimeout(() => {
                this.showHint();

            }, this.selfInactiveInterval);




        //Listener for Events that will be send to partner(s)

        window.addEventListener('blur',
            this.sendTabLostMessage.bind(this)
        );
        window.addEventListener('mousemove',
            this.testFunction.bind(this))
        window.addEventListener('onkeypress',
            this.testFunction.bind(this))

    }

    testFunction() {
        this.resetSelfTimer();
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

    showHint() {
        let position = Math.floor(Math.random() * this.hints.instructions.length);
        if (this.hints.instructions.length > 0) {
            this.props.setIncominginstruction(this.hints.instructions[position]);
            this.hints.instructions.splice(position, 1);
            this.resetSelfTimer();
        }

    }

    resetSelfTimer() {
        clearTimeout(this.selfTimeOut);

        this.selfTimeOut = setTimeout(() => {
            this.showHint();

        }, this.selfInactiveInterval);


    }




    resetTimer(partnerName) {
        this.partner = partnerName;
        clearTimeout(this.resetTimerVar);

        this.resetTimerVar = setTimeout(this.showMessage.bind(this), this.checkActiveMessageInterval);


    }
    showMessage() {
        if (this.partner) {
            this.props.setIncominginstruction(new Instruction("Dein Partner " + this.partner + " ist seit über " + this.checkActiveMessageInterval / 1000 + " Sekunden inaktiv. Tritt mit ihm in Kontakt.", ""))
            this.evalLoggerRef.logToEvaluation(this.constructor.name, INACTIVE, "Partner inactive for " + this.checkActiveMessageInterval / 1000 + " s");


        }
        else
            this.props.setIncominginstruction(new Instruction("Dein Partner ist aktuell nicht in der Sitzung.", ""))

    }

    sendTabLostMessage() {
        if (this.sessionId)
            if (this.props.rooms.rooms[this.sessionId]) {

                this.props.sendTabLostMessage(this.sessionId, this.props.auth.user.name, ownSocketId(), this.props.rooms.rooms[this.sessionId].state.sharedRoomData.clients);

            }
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
        window.sessionEvents.add(TIME_UPDATE, this.onVideoTimeUpdate,
            this.resetSelfTimer());
    }
    render() {
        return (
            <EvalLogger createRef={el => (this.evalLoggerRef = el)} />)
    }



}


const mapStateToProps = state => ({
    localState: state.localState,
    auth: state.auth,
    script: state.script,
    assistent: state.assistent
});

export default connect(
    mapStateToProps, { sendActiveMessage, setIncominginstruction, sendTabLostMessage }
)(ActivityOberserver);

