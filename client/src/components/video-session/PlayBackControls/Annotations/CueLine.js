import React, { Component } from "react";
import PropTypes from "prop-types";
import Cue from "./Cue";
import { connect } from "react-redux";
import "./cues.css";
import connectUserData from "../../../../highOrderComponents/OwnUserDataConsumer";

class CueLine extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   videoDuration: 0
    // };

    this.state = {
      cues: {}
    };

    // this.cuesTest = [120, 0, 30, 80, 140, 300];
  }

  componentWillReceiveProps(nextProps) {
    var targetCues = {};
    try {
      const annotations =
        nextProps.rooms.rooms[this.props.roomId].state.sharedRoomData
          .annotations;

      if (annotations) targetCues = annotations;
      else targetCues = {};
    } catch (e) {
      targetCues = {};
    }

    // check for add cue
    const annotationToEdit = nextProps.localState.annotationEditing;

    if (annotationToEdit && !(annotationToEdit.playTime in targetCues)) {
      const tempAddCue = {
        title: "New Annotation",
        text: "New Annotation",
        temporaryAdd: true,
        creator: { nick: this.props.ownNick, color: this.props.ownColor }
      };
      const currentCues = {
        ...targetCues,
        [annotationToEdit.playTime]: tempAddCue
      };
      targetCues = currentCues;
    }

    this.setState({ cues: targetCues });
  }

  getValidContent() {
    const keys = Object.keys(this.state.cues);

    const cues = keys.map(cuePoint => {
      const cuePointRaw = cuePoint;
      cuePoint = parseFloat(cuePoint);
      if (cuePoint > this.props.videoDuration)
        cuePoint = this.props.videoDuration;

      var percent = (cuePoint / this.props.videoDuration) * 100;

      if (percent > 100) percent = 100;

      return (
        <Cue
          key={cuePoint}
          positionAbs={cuePoint}
          positionRel={percent + "%"}
          meta={this.state.cues[cuePointRaw]}
        />
      );
    });

    return <div className="timeline-overlay cue-line">{cues}</div>;
  }

  render() {
    return this.props.videoDuration > 0 ? this.getValidContent() : null;
  }
}

CueLine.propTypes = {
  videoDuration: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  rooms: state.rooms,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  null
)(connectUserData(CueLine));
