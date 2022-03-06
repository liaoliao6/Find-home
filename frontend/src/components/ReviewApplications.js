import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../css/reviewapplications.css";
import axios from "axios";
import "../config";

class ReviewApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownedPropertyIDs: "",
      applicationsToReview: "",
      userID: sessionStorage.getItem("user_id"),
    };
  }

  // GET applications by approver id
  componentDidMount() {
    axios
      .get(window.serverRoot + "api/applications/approver/" + this.state.userID)
      .then((res) => {
        const data = res.data;
        console.log(data);
        this.setState({ applicationsToReview: data });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  approveApplicationSuccess = (response) => {
    this.props.animator("You have approved this application.");
  };

  rejectApplicationSuccess = (response) => {
    this.props.animator("You have rejected this application.");
  };

  approveApplication = (application_id) => {
    axios
      .get(window.serverRoot + "api/application/" + application_id + "/approve")
      .then((response) => this.approveApplicationSuccess(response))
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

  rejectApplication = (application_id) => {
    axios
      .get(window.serverRoot + "api/application/" + application_id + "/reject")
      .then((response) => this.rejectApplicationSuccess(response))
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
    const { applicationsToReview } = this.state;

    return (
      <div className="application-list">
        <table>
          <tr>
            <th>Property ID</th>
            <th>Applicant ID</th>
            <th>Status</th>
            <th>Property Type</th>
            <th>Applicant Email</th>
            <th>Credit Score</th>
            <th>Employment</th>
            <th>Offer</th>
            <th>Approve This Application</th>
          </tr>

          {applicationsToReview &&
            applicationsToReview.map((application) => {
              return (
                <tr>
                  <td>{application.property_id} </td>
                  <td>{application.applicant_id} </td>
                  <td>{application.status} </td>
                  {application.for_rent == true ? (
                    <td> Rental </td>
                  ) : (
                    <td>For Sale </td>
                  )}
                  <td>{application.application_info.user_email} </td>
                  <td>{application.application_info.credit_score} </td>
                  <td>{application.application_info.employment_info} </td>
                  <td>{application.application_info.offer} </td>

                  {application.status == "PENDING" ? (
                    <td>
                      {" "}
                      <button onClick={this.approveApplication(application.id)}>
                        Approve
                      </button>
                      <button onClick={this.rejectApplication(application.id)}>
                        Reject
                      </button>
                    </td>
                  ) : (
                    <td> Already Reviewed</td>
                  )}
                </tr>
              );
            })}
        </table>
      </div>
    );
  }
}

export default withRouter(ReviewApplications);
