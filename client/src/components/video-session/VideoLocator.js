import React, { Component } from "react";
import { sendSharedRoomData, ownSocketId } from "../../socket-handlers/api";

export default class VideoLocator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videourl: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();

    const syncAction = {
      sender: ownSocketId(),
      mediaAction: "changeVideoUrl",
      url: this.state.videourl,
      hash: Math.random()
    };

    sendSharedRoomData(this.props.roomId, "syncAction", syncAction, false);
  }

  handleChange(event) {
    this.setState({ videourl: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)} className="form-inline mb-2">
        <div className="form-group">
          <label className="sr-only" htmlFor="urlinput">
            Url Input
          </label>
          <input
            id="urlinput"
            value={this.state.videourl}
            type="text"
            className="form-control form-control-lg mr-sm-2"
            placeholder="Videolink"
            onChange={this.handleChange.bind(this)}
          />

          <input type="submit" className="btn btn-info btn-lg" value="Watch" />
        </div>
      </form>
    );
  }
}
