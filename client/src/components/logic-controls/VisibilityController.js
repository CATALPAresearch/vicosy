import { Component } from "react";
import { VISIBILITY_CHANGED } from "./genericAppEvents";
import { connect } from "react-redux";
import { setAppFocusState } from "../../actions/localStateActions";

class VisibilityController extends Component {
  constructor(props) {
    super(props);

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  componentWillMount() {
    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onVisibilityChange(e) {
    window.genericAppEvents.dispatch(
      VISIBILITY_CHANGED,
      !document.hidden,
      document.visibilityState
    );

    this.props.setAppFocusState(!document.hidden);
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setAppFocusState }
)(VisibilityController);
