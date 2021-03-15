import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, loginGuest } from "../../actions/authActions";
import ClientCounter from "../controls/ClientCounter";
import RoomComponent from "../controls/RoomComponent";
import classnames from "classnames";
import { clearError } from "../../actions/errorActions";
import { withRouter } from "react-router";
import { LOG } from "../logic-controls/logEvents";
import "./navbar.css";
import { TRAINER } from "../../actions/types";
import { setActive } from "../../actions/assistentActions";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.togglerRef = React.createRef();
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  setAssitent(e) {
    // if (this.props.assistent.active)
    this.props.setActive(!this.props.assistent.active);
    //else (this.props.setActive(false))
  }

  onWarningDismissed(e) {
    console.log("clearwarning");

    this.props.clearError("warning");
  }

  onGuestLogin() {
    this.props.loginGuest();
    this.props.history.push("/login");
  }

  onShareSession() {
    var url = window.location.href;
    window.logEvents.dispatch(LOG, {
      class: "success",
      message: `Send following URL to your friend: ${url}`
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    var warningMessage = null;
    if (isAuthenticated && "warning" in this.props.errors) {
      warningMessage = (
        <div
          className="alert alert-warning alert-dismissible show p-1 pr-4 mt-0 mb-0"
          role="alert"
        >
          {this.props.errors.warning}
          <button
            type="button"
            className="close p-1 mt-0 mb-0 pl-10"
            aria-label="Close"
            onClick={this.onWarningDismissed.bind(this)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    var errorMessage = null;
    if (isAuthenticated && "socket_disconnect" in this.props.errors) {
      errorMessage = (
        <span
          className="alert alert-danger p-1 mt-0 mb-0 mr-2 alpha-pulse"
          role="alert"
        >
          <strong>Disconnected</strong> - trying to reconnect...
        </span>
      );
    }

    const { isSession } = this.props;
    const userNav = (
      <li className="nav-item dropdown" id="dropdown-menu-pos">

        <a className="nav-link dropdown-toggle" id="dropdown-menu" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img
            className="rounded-circle"
            src={user.avatar}
            alt={user.name}
            style={{ width: "25px", marginRight: "5px" }}
            title="You must have a Gravatar connected to you email to display an image"
          />
          {this.props.auth.user.name}
        </a>
        <div className="dropdown-menu" id="RightNavItems" aria-labelledby="navbarDropdown">
          <li className="nav-item">
            <a className="nav-link" href="#">Settings</a>
          </li>
          <li className="nav-item">
            <a
              href=""
              onClick={this.onLogoutClick.bind(this)}
              className="nav-link"
            >
              Logout
          </a>
          </li>
        </div>
      </li>
    )


    const faqItem = (
      <li className="nav-item">
        <a
          className="nav-link"
          href="http://h2088653.stratoserver.net/closeuptogether/faq/closeup-faq.html"
          target="_blank"
        >
          FAQ <i className="fa fa-question-circle" />
        </a>
      </li>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          {this.props.auth.user.role === TRAINER ?
            <Link className="nav-link" to="/trainerlobby">
              Lobby <RoomComponent component={ClientCounter} roomId="trainerlobby" />
            </Link>

            :
            <Link className="nav-link" to="/studentlobby">
              Lobby <RoomComponent component={ClientCounter} roomId="studentlobby" />
            </Link>}
        </li>
        {/* <li>
          <Link className="nav-link" to="/testConference">
            Conference
          </Link>
        </li>
        <li
          className={classnames("nav-item", {
            "hidden-nosize": !isSession
          })}
        >
          
          <span>
            <a
              href="#"
              onClick={this.onShareSession.bind(this)}
              className="nav-link"
            >
              Share Session <i className="fa fa-share-alt-square" />
            </a>
          </span>
        </li>
        */}
        {faqItem}

        {userNav}
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        {faqItem}
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        {/* <li className="nav-item">
          <button
            className="btn btn-success ml-2"
            onClick={this.onGuestLogin.bind(this)}
          >
            Try (Guest Login)
          </button>
        </li>
        */
        }
      </ul>
    );

    return (
      <div>
        <nav
          className={classnames("navbar navbar-dark bg-dark ", {
            "mb-0": !isSession,
            "navbar-expand-sm": !isSession
          })}
        >
          {/* <a class="navbar-brand" href="#">Navbar</a> */}
          {this.props.auth.user.role === "STUDENT" ?
            <button id="switchAssistent" className="accordion" onClick={this.setAssitent.bind(this)}>Assistent</button> : null}
          <Link className="navbar-brand" style={{ pointerEvents: "none" }} to="/">
            CloseUpTogether
        </Link>
          {errorMessage}
          {warningMessage}

          <button
            ref={this.togglerRef}
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#RightNavItems"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            onClick={() => {
              if (isSession) this.togglerRef.current.click();
            }}
            className="collapse navbar-collapse"
            id="RightNavItems"
          >
            {/* {isSession ? sessionInfo : null} */}
            {isAuthenticated ? authLinks : guestLinks}


          </div>

        </nav>
        {this.props.assistent.warningMessage ?
          <div className="alert alert-warning">
            <strong>Warning!</strong> {this.props.assistent.warningMessage}
          </div> : null
        }
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  assistent: state.assistent
});

export default connect(
  mapStateToProps,
  { logoutUser, clearError, loginGuest, setActive }
)(withRouter(Navbar));
