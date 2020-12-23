import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "../../components/controls/PrivateRoute";

import SocketController from "../../components/logic-controls/SocketController";

//import YoutubePlayer from "videojs-youtube";
import Store from "../../store";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Landing from "../../components/layout/Landing";
import Register from "../../components/auth/Register";
import Login from "../../components/auth/Login";
import Lobby from "../../components/lobby/Lobby";
import StudentLobby from "../../components/studentlobby/StudentLobby";
import TrainerLobby from "../trainerlobby/TrainerLobby";
import VideoSession from "../../components/video-session/VideoSession";
// import P2PTest from "../../components/test/P2PTest";
// import WebRtcConferenceTest from "../../components/test/WebRtcConferenceTest";

import NotFound from "../../components/not-found/NotFound";
import VisibilityController from "../logic-controls/VisibilityController";
import TrainerScriptCreator from "../script-options/TrainerScriptCreation/TrainerScriptCreator";
import SubscribeToScript from "../script-options/Student/SubscribeToScript"
import Assistent from "../Assistent/Assistent";

class AppContent extends Component {
  render() {
    const isSessionPath = this.props.location.pathname.includes("/session");
    return (
      <div
        className={classnames("App", {
          AppFillScreen: isSessionPath
        })}
      >
        {/* invisible controllers */}
        <VisibilityController />


     

        <Navbar isSession={isSessionPath} />
        {this.props.assistent.active ? <Assistent /> : null}  
        < Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login/:scriptId" component={Login} />
        <Route exact path="/login" component={Login} />
        <SocketController>
          {/* <Route
            exact
            path="/testConference"
            component={WebRtcConferenceTest}
          />
          <Route exact path="/testSimplePeer" component={P2PTest} /> */}

          <Switch>
            { /* <PrivateRoute exact path="/lobby" component={Lobby} /> */}
            <PrivateRoute exact path="/studentlobby" component={StudentLobby} />


            <PrivateRoute
              exact
              path="/session/:sessionId"
              component={VideoSession}
            />
            <PrivateRoute exact path="/trainerlobby" component={TrainerLobby} />
            <PrivateRoute exact path="/newtrainerscript/" component={TrainerScriptCreator} />
            <Route exact path="/subscribeToScript/:scriptId" component={SubscribeToScript} />

          </Switch>
        </SocketController>
        <Route exact path="/not-found" component={NotFound} />
        <Footer isSession={isSessionPath} />
      </div>
    );
  }
}

AppContent.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  assistent: state.assistent
});

export default withRouter(connect(mapStateToProps)(AppContent), AppContent);

