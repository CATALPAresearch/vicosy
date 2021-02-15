import React, { Component } from "react";
import { connect } from "react-redux";
import "./progressBar.css";

export class ProgressBar extends Component {
    constructor(props) {
        super(props);

    }


    renderBar() {
console.log(this.props);
        var id0 = "";
        var id1 = "";
        var id2 = "";
        var id3 = "";
        var id4 = "";
        var id5 = "";
        var id6 = "";
        var id7 = "";
        if (this.props.assistent)
            if (this.props.assistent.phase)
                switch (this.props.assistent.phase.name) {
                    case "GETTOGETHER":
                        id0 = "actPhase";
                        break;
                    case "WARMUP":
                        id1 = "actPhase";
                        break;
                    case "SEPARATESECTIONSTUTORPRE":
                        id2 = "actPhase";
                        break;
                    case "SEPARATESECTIONSTUTORPOST":
                        id2 = "actPhase";
                        break;
                    case "SEPARATESECTIONSTUTEEPRE":
                        id2 = "actPhase";
                        break;
                    case "SEPARATESECTIONSTUTEEPOST":
                        id2 = "actPhase";
                        break;
                    case "PREPAREPRE":
                        id3 = "actPhase";
                        break;
                    case "PREPAREPOST":
                        id3 = "actPhase";
                        break;
                    case "PRESENTTUTORPRE":
                        id4 = "actPhase";
                        break;
                    case "PRESENTTUTORPOST":
                        id4 = "actPhase";
                        break;
                    case "PRESENTTUTEEPRE":
                        id5 = "actPhase";
                        break;
                    case "PRESENTTUTEEPOST":
                        id5 = "actPhase";
                        break;
                    case "DEEPENTUTEEPRE":
                        id6 = "actPhase";
                        break;
                    case "DEEPENTUTEEPOST":
                        id6 = "actPhase";
                        break;
                    case "DEEPENTUTORPRE":
                        id6 = "actPhase";
                        break;
                    case "DEEPENTUTORPOST":
                        id6 = "actPhase";
                        break;
                    case "REFLEXIONPRE":
                        id7 = "actPhase";
                        break;
                    case "REFLEXIONPOST":
                        id7 = "actPhase";
                        break;
                }
        return (

            <div className="progress">
                <div id={id0} style={{ borderLeftWidth: "0px" }} className="progress-bar" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">Start</div>
                {  this.props.script.isPhase0? <div id={id1} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Kennenlernen</div> : null}
                <div id={id2} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Unterteilen</div>
                <div id={id3} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Vorbereiten</div>
                <div id={id4} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Vorstellen</div>
                <div id={id5} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Zuhören</div>
                <div id={id6} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Vertiefen</div>
                {  this.props.script.isPhase5 ? <div id={id7} className="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">Reflexion</div> : null}
            </div>

        );


    }

    render() {
        var content = this.renderBar();
        return (
            <div id="ProgressBar">
                {content}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    localState: state.localState,
    assistent: state.assistent,
    script: state.script
});

export default connect(
    mapStateToProps
)(ProgressBar);
