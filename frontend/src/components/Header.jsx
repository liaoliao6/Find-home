import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Alert from  "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/landing.css";
import logo from "../img/logo3.png";
import axios from "axios";
import "../config";

import { Link, withRouter } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regModelShow: false,
      signInModalShow: false,
      signupFormValue: {
        name: "",
        role: "0",
        email: "",
        password: "",
        password2: "",
      },
      loginFormValue: {
        email: "",
        password: "",
      },
      messageOn: false,
      message: "",
      messageType: "success",
      isLoggedIn: false || sessionStorage.getItem("user") != null,
      loggedFirstName: "" || sessionStorage.getItem("user"),
    };
    this.props.setAnimator(this.animateMessage);
  }
  toggleRegModal = () => {
    this.setState({
      regModelShow: !this.state.regModelShow,
    });
  };
  toggleSignInModal = () => {
    this.setState({
      signInModalShow: !this.state.signInModalShow,
    });
  };
  setSignupFormValue = (inputName, event) => {
    var temp = this.state.signupFormValue;
    temp[inputName] = event.target.value;
    this.setState({
      signupFormValue: temp,
    });
  };
  setLoginFormValue = (inputName, event) => {
    var temp = this.state.loginFormValue;
    temp[inputName] = event.target.value;
    this.setState({
      loginFormValue: temp,
    });
  };
  signUpRequest = () => {
    var input = this.state.signupFormValue;
    var name = input.name;
    var role = input.role;
    var email = input.email;
    var password = input.password;
    var password2 = input.password2;
    if (
      name != "" &&
      role != "0" &&
      email != "" &&
      password.length >= 6 &&
      password == password2
    ) {
      var firstLast = name.split(/\s+/);
      var first_name = firstLast[0];
      var last_name = firstLast[firstLast.length - 1];
      input["first_name"] = first_name;
      input["last_name"] = last_name;
      this.postRequest(
        window.serverRoot + "api/user/signup",
        input,
        this.signUpSuccess, this.errorHandler
      );
    } else if (name === "") {
      this.animateMessage("Name cannot be empty", "danger");
    } else if (role === "0") {
      this.animateMessage("Please select a role", "danger");
    } else if (email === "") {
      this.animateMessage("Email cannot be empty", "danger");
    } else if (password.length < 6) {
      this.animateMessage("Minimum 6 characters password required", "danger");
    } else if (password !== password2) {
      this.animateMessage("Passwords don't match", "danger");
    }
  };
  animateMessage = (content, type = "success") => {
    this.setState({ message: content, messageType: type, messageOn: true });
  };
  signUpSuccess = (response) => {
    console.log(response);
    if (response.status === 201 && response.statusText === "CREATED") {
      this.animateMessage("Successfully created account, please Sign In");
      this.setState({ regModelShow: false });
    }
  };
  loginSuccess = (response) => {
    if (response.status === 200 && response.statusText === "OK") {
      if (response.data.role === "Landlord" || 
          response.data.role === "Seller" || response.data.role === "Realtor") {
        if (response.data.status === "PENDING") {
          this.animateMessage("Your account is still waiting to be approved by Admin, Please come back later", "info");
          this.setState({signInModalShow: false});
          return;
        }
      }
      this.animateMessage(
        "Signed In! Welcome back, " + response.data.first_name
      );
      this.setState({ signInModalShow: false, 
                      isLoggedIn: true,
                      loggedFirstName: response.data.first_name });
      sessionStorage.setItem("user", response.data.first_name);
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("user_id", response.data.id);
      sessionStorage.setItem("role", response.data.role);
      if (response.data.role === "Admin") {
        this.props.history.push("/admin");
      }
    }
  };
  
  errorHandler = (error) => {
    if(error.response) {
      this.animateMessage(error.response.data, "danger");
    } else {
      this.animateMessage("Error: " + error.message, "danger");
    }
  }

  postRequest = (url, input, successHandler, errorHandler) => {
    axios
      .post(url, input)
      .then((response) => successHandler(response))
      .catch((error) => errorHandler(error));
  };
  render() {
    var role = "";
    if (sessionStorage.getItem("user") != null) {
      role = sessionStorage.getItem("role");
    }
    return (
      <div>
        <Navbar fixed="top" expand="md" id="site-nav">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="logo" />
              <span>
                Home <span>Finder</span>
              </span>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <ul className="navbar-nav nav-mid-link">
                <li className="nav-item active">
                  <Link to="/" className="nav-link" id="home-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
              {this.state.isLoggedIn == false && sessionStorage.getItem("user") == null ? (
                <ul className="navbar-nav reg-or-sign">
                  <li className="nav-item">
                    <Button
                      className="nav-link reg-link"
                      id="nav-register-btn"
                      onClick={this.toggleRegModal}
                    >
                      <FontAwesomeIcon
                        style={{
                          marginRight: "4px",
                          color: "#005da8",
                          fontSize: "14px",
                        }}
                        icon="user"
                      />
                      Register
                    </Button>
                  </li>
                  <li className="nav-item">
                    <Button
                      className="nav-link signup-link"
                      id="nav-signin-btn"
                      onClick={this.toggleSignInModal}
                    >
                      Sign In
                    </Button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav loggedIn">
                  <li
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span>Hi,</span>
                    <Dropdown>
                      <Dropdown.Toggle id="user-dropdown-btn">
                        <span>{this.state.loggedFirstName || sessionStorage.getItem("user")}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu id="logged-drowdown">
                        { role==="Admin"?
                          <Dropdown.Item>
                          <div>
                           <Button onClick={()=>{this.props.history.push("/admin")}}>
                              My Admin
                           </Button>
                           </div>
                          </Dropdown.Item>
                        :<></>
                        }
                        <Dropdown.Item>
                        <div>
                          <Button onClick={()=>{this.props.history.push("/postProperties")}}>
                          My {(role==="Renter" || role==="Buyer")? "Application": "Properties"}
                          </Button>
                        </div>
                        </Dropdown.Item>
                        <Dropdown.Item>
                        <div>
                          <Button onClick={()=>{this.props.history.push("/myFavorites")}}>My favourites</Button>
                        </div>
                        </Dropdown.Item>
                        <Dropdown.Item>
                        <div id="logout-div">
                          <Button className="nav-link" id="logout-btn" 
                            onClick={()=> {this.setState({isLoggedIn: false,loggedFirstName:""}); sessionStorage.clear(); }}>
                            <FontAwesomeIcon
                              style={{
                                marginRight: "4px",
                                fontSize: "13px",
                              }}
                              icon="sign-out-alt"
                            />
                            Logout
                          </Button>
                        </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              )}
            </Navbar.Collapse>
          </div>
          <CSSTransition
            in={this.state.messageOn}
            timeout={1000}
            appear={false}
            classNames="fade"
            unmountOnExit={true}
            onEntered={() => {
              setTimeout(() => {
                this.setState({ messageOn: false});
              }, 3000);
            }}
          >
            <div id="message">
              <Alert variant={this.state.messageType}>{this.state.message}</Alert>
            </div>
          </CSSTransition>
        </Navbar>
        <button
          style={{
            position: "relative",
            top: "100px",
            zIndex: "9999",
            display: "none",
          }}
          onClick={() => {
            this.setState({ messageOn: !this.state.messageOn });
            this.setState({
              message: "Successfully created acount, please Sign In",
            });
          }}
        >
          toggle message on
        </button>
        <Modal
          show={this.state.regModelShow}
          id="registerModal"
          onHide={this.toggleRegModal}
        >
          <div className="modal-header">
            <h4 className="modal-title" id="registerLabel">
              Sign Up
            </h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={this.toggleRegModal}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <p className="lead">
              <i className="fa fa-user"></i> Create Your Account
            </p>
            <form className="form" id="registration-form" method="POST">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={this.state.signupFormValue.name}
                  onChange={(e) => this.setSignupFormValue("name", e)}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  name="role"
                  onChange={(e) => this.setSignupFormValue("role", e)}
                  required
                >
                  <option value="0">* Select Your Role</option>
                  <option value="Renter">Renter - I rent properties</option>
                  <option value="Landlord">
                    Landlord - I own properties to rent out
                  </option>
                  <option value="Buyer">Buyer - I buy properties</option>
                  <option value="Seller">
                    Seller - I own properties to sell
                  </option>
                  <option value="Realtor">
                    Realtor - I help people rent out or sell properties
                  </option>
                </select>
                <small className="form-text">
                  Give us an idea of what you are looking for
                </small>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={(e) => this.setSignupFormValue("email", e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  minLength="6"
                  onChange={(e) => this.setSignupFormValue("password", e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  minLength="6"
                  onChange={(e) => this.setSignupFormValue("password2", e)}
                  required
                />
              </div>
              <input
                type="button"
                className="btn btn-primary"
                value="Submit"
                onClick={this.signUpRequest}
              />
              <button
                type="button"
                className="btn btn-light my-1"
                id="signup-cancel-btn"
                onClick={this.toggleRegModal}
              >
                Cancel
              </button>
            </form>
            <p className="my-1" id="already-info">
              Already have a Home Finder account?{" "}
              <span
                style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => {
                  this.toggleRegModal();
                  this.toggleSignInModal();
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </Modal>

        <Modal
          className="modal fade"
          id="signInModal"
          show={this.state.signInModalShow}
          onHide={this.toggleSignInModal}
        >
          <div className="modal-header">
            <h4 className="modal-title" id="signInLabel">
              Sign In
            </h4>
            <button className="close" onClick={this.toggleSignInModal}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <form
              className="form"
              id="signup-form"
              method="POST"
              action="/signin"
            >
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  required
                  value={this.state.loginFormValue.email}
                  onChange={(e) => this.setLoginFormValue("email", e)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  minLength="6"
                  required
                  value={this.state.loginFormValue.password}
                  onChange={(e) => this.setLoginFormValue("password", e)}
                />
              </div>
              <input
                type="button"
                className="btn btn-primary"
                value="Submit"
                onClick={() =>
                  this.postRequest(
                    window.serverRoot + "api/user/login",
                    this.state.loginFormValue,
                    this.loginSuccess, this.errorHandler
                  )
                }
              />
              <button
                type="button"
                className="btn btn-light my-1"
                id="login-cancel-btn"
                onClick={this.toggleSignInModal}
              >
                Cancel
              </button>
            </form>
            <p className="my-1" id="already-info">
              Don't have a Home Finder account?{" "}
              <span
                style={{ color: "#007bff", cursor: "pointer" }}
                onClick={() => {
                  this.toggleSignInModal();
                  this.toggleRegModal();
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Header);