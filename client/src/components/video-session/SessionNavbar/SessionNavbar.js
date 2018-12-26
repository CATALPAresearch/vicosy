import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import MarkerDropDown from "./MarkerDropDown";
import AnnotationDropDown from "./AnnotationDropDown";
import SyncSwitch from "./SyncSwitch";
import "./SessionNavbar.css";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import FeatureRenderer from "../../controls/FeatureRenderer";
import { FEATURES } from "../../../reducers/featureTypes";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";

class SessionNavbar extends Component {
  constructor(props) {
    super(props);
  }

  onOpenSharedDocClick() {
    window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  }

  render() {
    return (
      <div
        id="SessionNavbar"
        className={classnames("p-1", {
          blur: this.props.blur
        })}
      >
        <span className="hFlexLayout">
          <FeatureRenderer feature={FEATURES.SHARED_DOC}>
            <button
              onClick={this.onOpenSharedDocClick.bind(this)}
              className="btn btn-secondary btn-sm mr-1"
              title=""
            >
              Shared Doc <i className="fa fa-file-alt" />
            </button>
          </FeatureRenderer>
          <SyncSwitch />
        </span>

        <div>
          <FeatureRenderer feature={FEATURES.ANNOTATING}>
            <AnnotationDropDown playerRef={this.props.playerRef} />
          </FeatureRenderer>
          <FeatureRenderer feature={FEATURES.MARKERS}>
            <MarkerDropDown />
          </FeatureRenderer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setSharedDocEditing }
)(SessionNavbar);
