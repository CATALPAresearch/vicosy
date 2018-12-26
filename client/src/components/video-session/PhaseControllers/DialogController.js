import React, { Component } from "react";
import connectShared from "../../../highOrderComponents/SharedRoomDataConsumer";
import { connect } from "react-redux";
import {
  OPEN_SHARED_DOC_REQUEST,
  CLOSE_SHARED_DOC_REQUEST,
  TOGGLE_SHARED_DOC_REQUEST
} from "../../logic-controls/dialogEvents";
import { setSharedDocEditing } from "../../../actions/localStateActions";
import { sendSharedRoomData, ownSocketId } from "../../../socket-handlers/api";
import sessionTypes from "../../../shared_constants/sessionTypes";

const SHARED_DOC_BEHAVIOUR_SYNC = "SHARED_DOC_BEHAVIOUR_SYNC";
const SHARED_DOC_BEHAVIOUR_ASYNC = "SHARED_DOC_BEHAVIOUR_ASYNC";

// controls dialog opening (Shared Doc & Annotation) depending on sync state and cooperation script
class DialogController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharedDocBehaviour: SHARED_DOC_BEHAVIOUR_ASYNC
    };

    this.onToggleSharedDocRequest = this.onToggleSharedDocRequest.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    window.dialogRequestEvents.add(
      TOGGLE_SHARED_DOC_REQUEST,
      this.onToggleSharedDocRequest
    );

    this.updateState(this.props);
  }

  componentWillUnmount() {
    window.dialogRequestEvents.remove(
      TOGGLE_SHARED_DOC_REQUEST,
      this.onToggleSharedDocRequest
    );
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    var nextSharedDocState;

    if (
      !this.props.settings.syncSharedDocInSyncSpace ||
      !this.props.localState.syncState.sync
    ) {
      nextSharedDocState = SHARED_DOC_BEHAVIOUR_ASYNC;
    } else {
      nextSharedDocState = SHARED_DOC_BEHAVIOUR_SYNC;
    }

    if (this.state.sharedDocBehaviour !== nextSharedDocState) {
      this.setState({ sharedDocBehaviour: nextSharedDocState });
    }

    if (nextSharedDocState === SHARED_DOC_BEHAVIOUR_SYNC) {
      // I am in sync space & dialog behaviour is shared
      const sharedDialogAction = props.sharedRoomData.getAtPath(
        "dialogAction.type",
        null
      );

      const isSharedEditingOpen = this.props.localState.sharedDocEditing.isOpen;
      if (!isSharedEditingOpen && sharedDialogAction === "sharedDoc")
        this.props.setSharedDocEditing(true);
      else if (isSharedEditingOpen && sharedDialogAction !== "sharedDoc")
        this.props.setSharedDocEditing(false);
    }
  }

  onToggleSharedDocRequest() {
    const isOpened = this.props.localState.sharedDocEditing.isOpen;
    if (this.state.sharedDocBehaviour === SHARED_DOC_BEHAVIOUR_ASYNC) {
      this.props.setSharedDocEditing(!isOpened);
    } else {
      const dialogAction = {
        type: !isOpened ? "sharedDoc" : null
      };
      sendSharedRoomData(
        this.props.roomId,
        "dialogAction",
        dialogAction,
        false
      );
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  localState: state.localState,
  settings: state.settings
});

const reduxConnected = connect(
  mapStateToProps,
  { setSharedDocEditing }
)(DialogController);

export default connectShared(reduxConnected);
