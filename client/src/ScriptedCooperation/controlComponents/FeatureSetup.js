import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  enableFeatures,
  disableFeatures
} from "../../actions/restrictionActions";

export const MODE_DISABLE_ALL_BUT = "MODE_DISABLE_ALL_BUT";
export const MODE_ENABLE_ALL_BUT = "MODE_DISABLE_ALL_BUT";

class FeatureSetup extends Component {
  constructor(props) {
    super(props);

    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    if (props.mode === MODE_DISABLE_ALL_BUT) {
      this.props.disableFeatures();

      if (props.features.length > 0) this.props.enableFeatures(props.features);
    } else {
      this.props.enableFeatures();

      if (props.features.length > 0) this.props.disableFeatures(props.features);
    }
  }

  render() {
    return null;
  }
}

FeatureSetup.propTypes = {
  mode: PropTypes.string, // MODE_DISABLE_ALL_BUT or MODE_ENABLE_ALL_BUT
  features: PropTypes.array
};

FeatureSetup.defaultProps = {
  mode: MODE_DISABLE_ALL_BUT,
  features: []
};

export default connect(
  null,
  { enableFeatures, disableFeatures }
)(FeatureSetup);
