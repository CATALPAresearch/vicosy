import React, { Component } from "react";
import { shadeColor } from "../../../helpers/colorHelper";

export default class LoadingIndicator extends Component {
  render() {
    const primaryColor = this.props.color;
    const secondaryColor = shadeColor(primaryColor);

    return (
      <div
        className="client-loading-indicator"
        style={{
          border: `8px solid ${secondaryColor}`,
          borderTop: `8px solid ${primaryColor}`
        }}
      >
        {/* <i className="fa fa-spinner" /> */}
      </div>
    );
  }
}
