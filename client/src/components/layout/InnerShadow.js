import React, { Component } from "react";

// requires a parent with non static (e.g. relative position)
export default class InnerShadow extends Component {
  render() {
    return (
      <div className={`inner-shadow-component ${this.props.cssClasses}`} />
    );
  }
}

InnerShadow.defaultProps = {
  cssClasses: "inner-shadow-black"
};
