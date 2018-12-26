import React, { Component } from "react";
import { connect } from "react-redux";
import "./cues.css";
import SectionHighlight from "./SectionHighlight";

class SectionLine extends Component {
  getValidContent() {
    const sections = this.props.localState.sections.highlights;

    const sectionComponents = sections.map(sectionMeta => {
      return (
        <SectionHighlight
          maxDuration={this.props.videoDuration}
          meta={sectionMeta}
        />
      );
    });

    return (
      <div className="timeline-overlay section-line">{sectionComponents}</div>
    );
  }

  render() {
    return this.props.videoDuration > 0 ? this.getValidContent() : null;
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  null
)(SectionLine);
