import React, { Component } from "react";
import { connect } from "react-redux";
import "./progressBar.css";

export class ProgressBar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="ProgressBar">
                <div class="progress">
                    <div id="phase0" className="w-25 p-3 progress-bar" role="progressbar"  aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">Start</div>
                    <div id="phase1" className="w-25 p-3 progress-bar bg-success" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">Kennenlernen</div>
                    <div id="phase2"className="w-25 p-3 progress-bar bg-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Unterteilen</div>
                    <div id="phase3"className="w-25 p-3 progress-bar bg-warning" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Präsentieren</div>
                    <div id="phase4"className="w-25 p-3 progress-bar bg-danger" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Vertiefen</div>
                
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    localState: state.localState,
    assistent: state.assistent
});

export default connect(
    mapStateToProps
)(ProgressBar);
