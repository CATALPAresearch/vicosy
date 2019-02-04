import React, { Component } from "react";
import "./individual-notes.css";
import { connect } from "react-redux";
import { initializeFirePadApp } from "../../../../helpers/firePadHelper";
import classnames from "classnames";

class IndividualNotes extends Component {
  constructor(props) {
    super(props);

    this.firebaseApp = null;
    this.firePad = null;
    this.codeMirror = null;

    this.focusCodeMirror = this.focusCodeMirror.bind(this);
  }

  initializeFirepad() {
    this.firebaseApp = initializeFirePadApp();

    // Get Firebase Database reference.
    // var firepadRef = this.getExampleRef();

    // user has same pad for unique video url
    const userNameHash = this.props.auth.user.name.hashCode();

    const videoUrlHash = this.props.rooms.rooms[
      this.props.roomId
    ].state.sharedRoomData.meta.videoUrl.hashCode();

    var firepadRef = window.firebase
      .database()
      .ref(`firepads/${userNameHash}/${videoUrlHash}`);

    // Create CodeMirror (with lineWrapping on).
    this.codeMirror = window.CodeMirror(
      document.getElementById("firepad-individual"),
      {
        lineWrapping: true
      }
    );

    const options = {
      richTextShortcuts: true,
      richTextToolbar: true,
      defaultText: `Hello, ${
        this.props.auth.user.name
      }! These are your individual Notes!`
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

  componentWillUnmount() {
    this.firebaseApp = null;
  }

  focusCodeMirror() {
    if (this.codeMirror) {
      this.codeMirror.focus();
      this.codeMirror.setCursor(this.codeMirror.lineCount(), 0);
    }
  }

  componentWillReceiveProps(nextProps) {
    const isOpen = nextProps.localState.sideBarTab.activeTab === "notes-tab";

    if (isOpen && !this.firebaseApp) {
      this.initializeFirepad();
    }
  }

  render() {
    return (
      <div
        className={classnames("individual-notes", {
          "hidden-nosize": !this.props.visible
        })}
      >
        <div id="firepad-individual" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  localState: state.localState,
  rooms: state.rooms
});

IndividualNotes.defaultProps = {
  visible: true
};

export default connect(
  mapStateToProps,
  null
)(IndividualNotes);
