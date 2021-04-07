import { Component } from "react";
import {
  openPublicGuide,
  closePublicGuide
} from "../../actions/localStateActions";
import { connect } from "react-redux";

class GuideController extends Component {
  render() {
    return null;
  }

  componentDidMount() {
    this.props.createRef(this);
  }

  // public
  openGuide(publicUrl, confirmationMode = "simple") {
    this.props.openPublicGuide(publicUrl, confirmationMode);


  }

  // public
  closeGuide() {
    this.props.closePublicGuide();


  }
}

export default connect(
  null,
  { openPublicGuide, closePublicGuide }
)(GuideController);
