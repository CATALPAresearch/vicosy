import React, { Component } from "react";
import "./shared-doc.css";
import classnames from "classnames";
import { connect } from "react-redux";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import { TOGGLE_SHARED_DOC_REQUEST } from "../../logic-controls/dialogEvents";
import { initializeFirePadApp } from "../../../helpers/firePadHelper";

class SharedDoc extends Component {
  constructor(props) {
    super(props);

    this.firebaseApp = null;
    this.firePad = null;
    this.codeMirror = null;

    this.focusCodeMirror = this.focusCodeMirror.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {
    if (this.firePad) {
      this.firePad.dispose();
      this.firePad = null;
    }

    if (this.firebaseApp) {
      this.firebaseApp.delete();
      this.firebaseApp = null;
    }

    this.codeMirror = null;
  }

  onCloseClick() {
    window.dialogRequestEvents.dispatch(TOGGLE_SHARED_DOC_REQUEST);
  }

  initializeFirepad() {
    this.firebaseApp = initializeFirePadApp();

    // Get Firebase Database reference.
    // var firepadRef = this.getExampleRef();

    // shared doc is unique for roomId (hashed sessionname + videourl, tbd: change for future purposes)
    var firepadRef = window.firebase
      .database()
      .ref(`firepads/${this.props.roomId}`);

    // Create CodeMirror (with lineWrapping on).
    this.codeMirror = window.CodeMirror(document.getElementById("firepad"), {
      lineWrapping: true
    });

    this.focusCodeMirror();

    const options = {
      richTextShortcuts: true,
      richTextToolbar: true,
      defaultText: "Hello, World!"
    };

    if (this.props.ownUserData) {
      options.userId = this.props.ownUserData.id;
      options.userColor = this.props.ownUserData.color;
    }

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    this.firePad = window.Firepad.fromCodeMirror(
      firepadRef,
      this.codeMirror,
      options
    ).on("ready", () => {
      this.focusCodeMirror();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.localState.sharedDocEditing.isOpen && !this.firebaseApp) {
      this.initializeFirepad();
    } else if (nextProps.localState.sharedDocEditing.isOpen) {
      setTimeout(() => {
        this.focusCodeMirror();
      }, 100);
    }
  }

  focusCodeMirror() {
    if (this.codeMirror) {
      this.codeMirror.focus();
      this.codeMirror.setCursor(this.codeMirror.lineCount(), 0);
    }
  }

  render() {
    return (
      <div
        id="SharedDoc"
        className={classnames("", {
          "hidden-nosize": !this.props.localState.sharedDocEditing.isOpen,
          docOffsetWithCollaborationBar: this.props.useOffset,
          docOffsetWithoutCollaborationBar: !this.props.useOffset
        })}
      >
        <div id="SharedDocContent">
          <div id="firepad" />

          {/* <button
            onClick={this.onCloseClick.bind(this)}
            className="close-btn btn btn-info"
          >
            <i className="fa fa-times-circle" />
          </button> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  localState: state.localState
});

export default connect(
  mapStateToProps,
  { setSharedDocEditing }
)(SharedDoc);
