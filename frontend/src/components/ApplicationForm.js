import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../css/applicationform.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../config";

// new version

class ApplicationForm extends Component {
  constructor(props) {
    super(props);

    var queryString = this.props.location.search;
    var paramObj = new URLSearchParams(queryString);

    this.state = {
      // isLoggedIn: true,
      application: {
        applicant_id: sessionStorage.getItem("user_id"),
        property_id: paramObj.get("id"),
        for_rent: this.props.for_rent,
        application_info: {
          user_email: sessionStorage.getItem("email"),
          credit_score: "",
          employment_info: "",
          offer: "",
        },
        approver_id: this.props.property.manager_id,
      },
    };
  }

  setUserEmail = (event) => {
    this.setState((prevState) => ({
      application: {
        ...prevState.application,
        application_info: {
          ...prevState.application.application_info,
          user_email: event.target.value,
        },
      },
    }));
  };
  isMatched = (role, for_rent) => {
      if (role == "Admin") {
          return true;
      } 
      if (role == "Renter" && for_rent) {
          return true;
      }
      if (role == "Buyer" && !for_rent) {
          return true;
      }
      return false;
  }
  setCreditScore = (event) => {
    this.setState((prevState) => ({
      application: {
        ...prevState.application,
        application_info: {
          ...prevState.application.application_info,
          credit_score: event.target.value,
        },
      },
    }));
  };

  setEmploymentInfo = (event) => {
    this.setState((prevState) => ({
      application: {
        ...prevState.application,
        application_info: {
          ...prevState.application.application_info,
          employment_info: event.target.value,
        },
      },
    }));
  };

  setOffer = (event) => {
    this.setState((prevState) => ({
      application: {
        ...prevState.application,
        application_info: {
          ...prevState.application.application_info,
          offer: event.target.value,
        },
      },
    }));
  };

  PostApplicationSuccess = (response) => {
    // if (response.status === 500 || response.status === 403 || response.status === 400) {
    //     this.props.animator("Please reapply.")
    // } else {
    //     this.props.animator("You have submitted the application successfully!")
    // }
    this.props.animator("You have submitted the application successfully!");
    var empty = {
        user_email: sessionStorage.getItem("email"),
        credit_score: "",
        employment_info: "",
        offer: "",
    }
    var curAppl = this.state.application;
    curAppl.application_info = empty;
    this.setState({application: curAppl});
  };

  postApplicationRequest = (e) => {
    e.preventDefault();
    console.log(this.state.application);
    axios({
      method: "post",
      url: window.serverRoot + "api/application/apply",
      data: this.state.application,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => this.PostApplicationSuccess(response))
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log("Error", error.message);
        }
      });
  };

  render() {
    return (
      <div className="application">
        <div className="row" style={{marginBottom: "2px"}}>
          <div className="col-sm-4">
            <hr />
          </div>
          <div className="col-sm-4" style={{ textAlign: "center" }}>
            <h3 className="application-title">Apply</h3>
          </div>
          <div className="col-sm-4">
            <hr />
          </div>
        </div>
        <p className="lead" style={{ textAlign: "center", fontSize: "14px"}}>
          Send an application email to seller/landlord
        </p>

        <form
          className="form"
          id="application-form"
          style={{position: "relative"}}
        >
        {this.props.user === null || !this.isMatched(sessionStorage.getItem("role"), this.props.for_rent) ?
        <div className="form-block">
            You need a {this.props.for_rent ? "Renter" : "Buyer"} account to apply for this property
        </div> : <></> }
        { this.props.for_rent ?
          <div className="formBody">
            <div className="form-group">
              <h3>Contact Email</h3>
              <input
                type="text"
                placeholder="Required for all applicants*"
                name="user_email"
                value={this.state.application.application_info.user_email}
                // value={user_email}
                // onChange={onChange}
                // onChange={(e) => this.setApplicationFormValue("user_email", e)}
                onChange={(e) => this.setUserEmail(e)}
                required
              />
            </div>

            <div className="form-group">
              <h3>Credit Score</h3>
              <input
                type="text"
                placeholder="Required for renters*"
                name="credit_score"
                value={this.state.application.application_info.credit_score}
                // onChange={onChange}
                // onChange={(e) => this.setApplicationInfoValue("credit_score", e)}
                onChange={(e) => this.setCreditScore(e)}
                required
              />
            </div>

            <div className="form-group">
              <h3>Employment Info</h3>
              <input
                type="text"
                placeholder="Required for renters*"
                name="employment info"
                value={this.state.application.application_info.employment_info}
                // value={employment_info}
                // onChange={onChange}
                // onChange={(e) => this.setApplicationInfoValue(employment_info, e)}
                onChange={(e) => this.setEmploymentInfo(e)}
                required
              />
            </div>
            <button type="button"
                onClick={this.postApplicationRequest}>Submit</button>
          
          </div>
          : 
          <div className="formBody">
            <div className="form-group">
              <h3>Contact Email</h3>
              <input
                type="text"
                placeholder="Required for all applicants*"
                name="user_email"
                value={sessionStorage.getItem("email")}
                // value={user_email}
                // onChange={onChange}
                // onChange={(e) => this.setApplicationFormValue("user_email", e)}
                onChange={(e) => this.setUserEmail(e)}
                required
              />
            </div>
            <div className="form-group">
              <h3>Offer $</h3>
              <input
                type="text"
                placeholder="Required for buyers*"
                name="offer"
                value={this.state.application.application_info.offer}
                // value={offer}
                // onChange={onChange}
                // onChange={(e) => this.setApplicationInfoValue("offer", e)}
                onChange={(e) => this.setOffer(e)}
                required
              />
            </div>
            <button onClick={this.postApplicationRequest}>Submit</button>
          </div>
        }
        </form>
      </div>
    );
  }
}

export default withRouter(ApplicationForm);
