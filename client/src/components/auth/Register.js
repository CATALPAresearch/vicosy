import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import ValidatedInput from "../controls/ValidatedInput";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import SelectListGroup from "../controls/SelectListGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      role: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });

    console.log(e.target.value);
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role
    };
    alert(this.state.role)
    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    const options = [];
    options.push({
      label: "Trainer",
      value: "trainer"
    });
    options.push({
      label: "Student",
      value: "student"
    });


    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Erstelle deinen CloseUpTogether-account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <ValidatedInput
                  id="name"
                  errors={errors}
                  onChange={this.onChange}
                  valueProvider={this.state}
                  placeHolder="Name"
                />

                <ValidatedInput
                  id="email"
                  type="email"
                  errors={errors}
                  onChange={this.onChange}
                  valueProvider={this.state}
                  placeHolder="Email Adress"
                  hintText="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />

                <ValidatedInput
                  id="password"
                  type="password"
                  errors={errors}
                  onChange={this.onChange}
                  valueProvider={this.state}
                  placeHolder="Password"
                />

                <ValidatedInput
                  id="password2"
                  type="password"
                  errors={errors}
                  onChange={this.onChange}
                  valueProvider={this.state}
                  placeHolder="Confirm Password"
                />
                <p className="text-md-left">
                  Wähle eine Rolle:
              </p>
                <SelectListGroup
                  id="roles"
                  name="roles"
                  options={options}
                  onChange={this.onChange}
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// auth state into props => this.props.auth
// map prop var to reducer
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
