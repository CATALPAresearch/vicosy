import { Component } from "react";
import { LOG, LOG_ERROR } from "./logEvents";
import { connect } from "react-redux";
import { logToChat } from "../../actions/roomActions";

/**
 * Collects various messages and outputs it (e.g. in the current chat)
 */
class Logger extends Component {
  constructor(props) {
    super(props);

    this.onLogMessage = this.onLogMessage.bind(this);
    this.onLogErrorMessage = this.onLogErrorMessage.bind(this);
  }

  componentDidMount() {
    window.logEvents.add(LOG, this.onLogMessage);
    window.logEvents.add(LOG_ERROR, this.onLogErrorMessage);
  }

  componentWillUnmount() {
    window.logEvents.remove(LOG, this.onLogMessage);
    window.logEvents.remove(LOG_ERROR, this.onLogErrorMessage);
  }

  onLogMessage(logData) {
    if (logData.roomId && this.props.roomId !== logData.roomId) return;
    setTimeout(() => {
      this.props.logToChat(this.props.roomId, logData);
    }, 100);
  }

  onLogErrorMessage(logData) {
    logData.class = "danger";
    this.onLogMessage(logData);
  }

  render() {
    return null;
  }
}

// const mapStateToProps = state => ({
//   rooms: state.rooms
// });

export default connect(
  null,
  { logToChat }
)(Logger);
