import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import MarkerDropDown from "./MarkerDropDown";
import AnnotationDropDown from "./AnnotationDropDown";
import SyncSwitch from "./SyncSwitch";
import "./SessionNavbar.css";
import FeatureRenderer from "../../controls/FeatureRenderer";
import { FEATURES } from "../../../reducers/featureTypes";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";
import { FETCH_ANNOTATIONS } from "../../logic-controls/annotationEvents";
import MainRessourceTabs from "./MainRessourceTabs";
import Interactive from "../../controls/Interactive";

class SessionNavbar extends Component {
  constructor(props) {
    super(props);

    this.onFetchAnnotationsClick = this.onFetchAnnotationsClick.bind(this);
  }

  // onOpenSharedDocClick() {
  //   window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  // }

  onFetchAnnotationsClick() {
    window.annotationEvents.dispatch(FETCH_ANNOTATIONS);
  }

  render() {
    return (
      <div
        id="SessionNavbar"
        className={classnames("p-1", {
          blur: this.props.blur
        })}
      >
        <span id="SessionNavbarContent" className="hFlexLayout">
          <MainRessourceTabs 
          sessionId={this.props.roomId}
          />
          <Interactive disabled={false} disabledMessage="Zurzeit deaktiviert">
            <SyncSwitch />
          </Interactive>
        </span>
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
  null
)(SessionNavbar);
