import React, { Component } from "react";
import ValidatedInput from "../controls/ValidatedInput";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginGuest } from "../../actions/authActions";
import TextFieldGroup from "../controls/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.onAuthenticated(this.props.auth.user.role);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.onAuthenticated(nextProps.auth.user.role);
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onAuthenticated(role) {
    const pathAfterLogin = localStorage.getItem("pathAfterLogin");
    console.log("path after login", pathAfterLogin);
    if (pathAfterLogin && pathAfterLogin.includes("/session")) {
      this.props.history.push(pathAfterLogin);
      localStorage.removeItem("pathAfterLogin");
    } else {
      switch (role) {
        case "TRAINER":
          this.props.history.push("/trainerlobby");
          break;
        case "trainer":
          this.props.history.push("/trainerlobby");
          break;
        case "STUDENT":
          this.props.history.push("/studentlobby");
          break;
        default:
          this.props.history.push("/lobby");
          break;

      }

    }
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  }

  loginGuest(e) {
    this.props.loginGuest();
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your CloseUpTogether account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Adress"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <ValidatedInput
                  id="password"
                  type="password"
                  errors={errors}
                  onChange={this.onChange}
                  valueProvider={this.state}
                  placeHolder="Password"
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, loginGuest }
)(Login);
