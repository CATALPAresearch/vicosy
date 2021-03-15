import { Component } from "react";
import PropTypes from "prop-types";

// renders children only if visible set to true
export default class ChildrenRenderer extends Component {
  render() {
    const { visible, children } = this.props;

    return visible ? children : null;
  }
}

ChildrenRenderer.propTypes = {
  visible: PropTypes.bool.isRequired
};
