import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SectionHighlight extends Component {
  render() {
    const { meta, maxDuration } = this.props;

    const { startTime, endTime } = meta;

    // times to percent
    const leftPosition = (startTime / maxDuration) * 100 + "%";
    const rightPosition =
      (endTime === -1 ? 0 : (1 - endTime / maxDuration) * 100) + "%";

    return (
      <span
        className={classnames("section-highlight", {
          "section-primary": !meta.style || meta.style === "primary",
          "section-secondary": meta.style === "secondary"
        })}
        style={{ left: leftPosition, right: rightPosition }}
      />
    );
  }
}

SectionHighlight.propTypes = {
  meta: PropTypes.object.isRequired
};
