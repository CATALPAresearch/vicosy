import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { setMarkerType } from "../../../actions/settingActions";
import { LOG_ERROR } from "../../logic-controls/logEvents";
import connectUIState from "../../../highOrderComponents/UIStateConsumer";
import HintArrow from "../../Assistent/HintArrow";

class MarkerDropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMarkerType: "marker-transient"
    };
  }

  onMarkerChange(markerType, unavailableMessage) {
    if (unavailableMessage) {
      window.logEvents.dispatch(LOG_ERROR, {
        message: unavailableMessage
      });
      return;
    }

    this.props.setMarkerType(markerType);
  }

  componentWillMount() {
    this.updateBySettings(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateBySettings(nextProps);
  }

  updateBySettings(props) {
    if (props.settings) {
      this.setState({ selectedMarkerType: props.settings.markerType });
    }
  }

  render() {
    if (!this.props.isMarkerUsable) return null;

    return (
      <div id="maker-button" className="btn-group dropleft ml-1">
        <button
          type="button"
          className="btn btn-sm primaryCol dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.props.assistent.actInstruction?this.props.assistent.active && this.props.assistent.incomingInstruction&&this.props.assistent.incomingInstruction.markers === "maker-button" ?
            <HintArrow
              style={{ position: "absolute", marginTop: -80, marginLeft: 20, zIndex: 1000 }}
              direction="down"
            /> : null:null}
          Marker{" "}
          <i
            className={classnames("fa", {
              "fa-highlighter": this.state.selectedMarkerType !== "marker-none",
              "fa-minus-circle": this.state.selectedMarkerType === "marker-none"
            })}
          />
        </button>
        <div className="dropdown-menu">
          <a
            className={classnames("dropdown-item", {
              active: this.state.selectedMarkerType === "marker-none"
            })}
            onClick={this.onMarkerChange.bind(this, "marker-none", false)}
            href="#"
          >
            <i className="fa fa-minus-circle" /> No Marker
          </a>
          <a
            className={classnames("dropdown-item", {
              active: this.state.selectedMarkerType === "marker-transient"
            })}
            title="Drawings will cause video to stop. They will be cleared on frame change."
            onClick={this.onMarkerChange.bind(this, "marker-transient", false)}
            href="#"
          >
            <i className="fa fa-highlighter" /> Frame Temporary Marker
          </a>
          <a
            className="dropdown-item disabled"
            title="Drawings will cause video to stop. They stay persistent in the current frame. An annotation will be created."
            onClick={this.onMarkerChange.bind(
              this,
              "marker-permanent",
              "Permanent marker not available yet."
            )}
            href="#"
          >
            Frame Permanent Marker
          </a>
          <a
            className="dropdown-item disabled"
            title="Mark while playing (video will not stop), drawings will fade out after short delay."
            onClick={this.onMarkerChange.bind(
              this,
              "marker-fading",
              "Fading marker not available yet."
            )}
            href="#"
          >
            Fading Marker
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  localState: state.localState,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { setMarkerType }
)(connectUIState(MarkerDropDown));
