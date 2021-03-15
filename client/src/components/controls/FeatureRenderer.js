import  { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// renders children only if feature is not disabled
class FeatureRenderer extends Component {
  render() {
    const { feature, restrictions, children } = this.props;
    const renderFeature = !(feature in restrictions.disabledFeatures);

    return renderFeature ? children : null;
  }
}

FeatureRenderer.propTypes = {
  feature: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  restrictions: state.restrictions
});

export default connect(
  mapStateToProps,
  null
)(FeatureRenderer);
