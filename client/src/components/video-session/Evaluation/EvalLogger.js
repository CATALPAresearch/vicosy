import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { evalLogToRoom } from "../../../socket-handlers/api";
export class EvalLogger extends Component {
    constructor(props) {
        super(props);
      this.sessionId = this.props.location.pathname.split("/")[2]

    }
    logToEvaluation(source, logevent, options) {
        evalLogToRoom(this.props.script._id, this.sessionId, this.sessionId + ",videoposition," + this.props.auth.user.name + "," + this.props.script.videourl + "," + this.props.assistent.phase.name + "," + source + ","+logevent + "," + options);
    }



    render() { return null; }
    
    componentDidMount() {
        this.props.createRef(this);
    }

}



const mapStateToProps = state => ({
    auth: state.auth,
    rooms: state.rooms,
    errors: state.errors,
    localState: state.localState,
    assistent: state.assistent,
    script: state.script
});

export default connect(
    mapStateToProps
)(withRouter(EvalLogger));
