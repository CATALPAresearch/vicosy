import React, { Component } from "react";
import PropTypes from "prop-types";
import Iframe from "react-iframe";

export default class HTMLLoader extends Component {
  render() {
    return (
      // <div style={{width: 100%, height:100%}}>
      <Iframe
        url={this.props.url}
        id="myId"
        className="myClassname"
        display="initial"
        height="100%"
        styles={{
          position: "absolute",
          top: "200",
          left: "0",
          right: "0",
          bottom: "0",
          height: "800px"

        }}
      />
      // </div>
    );
  }
}

HTMLLoader.propTypes = {
  url: PropTypes.string.isRequired
};
