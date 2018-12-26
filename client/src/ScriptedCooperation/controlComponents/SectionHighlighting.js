import React, { Component } from "react";
import { setSectionHighlights } from "../../actions/localStateActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SectionHighlighting extends Component {
  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillUnmount() {
    this.props.setSectionHighlights([]);
  }

  updateState(props) {
    const { collabScript } = props.sessionData;
    const ownRole = props.ownRole;
    const payload = collabScript.phaseData.payload;

    // extract section highlighting

    const highlightDatas = [];
    if (payload && payload.sectionTimes) {
      // section times by roles (async phase)

      const roles = Object.keys(payload.sectionTimes);

      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const highlightData = { ...payload.sectionTimes[role] };
        if (role === ownRole) {
          highlightData.style = "primary";
        } else {
          highlightData.style = "secondary";
        }

        highlightDatas.push(highlightData);
      }
    } else if (payload && payload.sectionTime) {
      // section time for all (sync phase)

      const highlightData = { ...payload.sectionTime };
      highlightData.style = "primary";
      highlightDatas.push(highlightData);
    }

    this.props.setSectionHighlights(highlightDatas);
  }

  render() {
    return null;
  }
}

SectionHighlighting.propTypes = {
  sessionData: PropTypes.object,
  ownRole: PropTypes.string
};

const mapStateToProps = state => ({
  rooms: state.rooms,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setSectionHighlights }
)(SectionHighlighting);
