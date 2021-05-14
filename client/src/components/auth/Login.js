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
        case "STUDENT":
          {
            
            if (this.props.location.search)
              this.props.history.push("/subscribeToScript/" + this.props.location.search.replace('?', ''))
            else
              this.props.history.push("/studentlobby");

          }
          break;

        default:
          {
            
            if (this.props.location.search)
              this.props.history.push("/subscribeToScript/" + this.props.location.search.replace('?', ''))
            else
              this.props.history.push("/studentlobby");

          }
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
/*
  openAuth (e) {
  
    var OAuth = require('oauth');
 
     var OAuth2 = OAuth.OAuth2;    
     var twitterConsumerKey = '335_1856al34udggoc48ksk0kgw8c4gcs880kg0kg0k4ks8k0soc88';
     var twitterConsumerSecret = '1yjg87r0fdj4w0g8skokswkc88gokocc0kscgkw0kk4c8k8oos';
     var oauth2 = new OAuth2(twitterConsumerKey,
       twitterConsumerSecret, 
       'https://www.gybond.de/iserv/', 
       null,
       'oauth/v2/token', 
       null);
     oauth2.getOAuthAccessToken(
       '',
       {'grant_type':'client_credentials'},
       function (e, access_token, refresh_token, results){
       console.log('bearer: ',access_token);
    });
   
  }
  */

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Logg' dich in deinen CloseUpTogether-Account ein
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
                <input type="submit"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"}}
                className="btn primaryCol mt-4 w-25" />
              </form>
              {
                /*<button onClick={this.openAuth.bind(this)}>OpenAuth</button>*/}
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
