import React, { Component } from "react";
import { connect } from "react-redux";

class ActivityCounter extends Component {
  render() {
    const unseenCount = this.props.localState.unseenActivities.count;

    return unseenCount === 0 ? null : (
      <span class="alpha-pulse badge badge-info">{unseenCount}</span>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  null
)(ActivityCounter);
