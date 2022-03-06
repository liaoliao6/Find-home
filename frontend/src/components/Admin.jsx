import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../css/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "../config";
class Admin extends Component {
  constructor(pros) {
    super(pros);
    var queryString = this.props.location.search;
    var paramObj = new URLSearchParams(queryString);
    this.state = {
      sidePanelShow: true,
      users: [],
      currentTab: paramObj.get("tab") == null ? "user" : paramObj.get("tab"),
      deleteModalShow: false,
    };
  }

  componentDidMount() {
    if (
      sessionStorage.getItem("user") == null ||
      sessionStorage.getItem("role") != "Admin"
    ) {
      this.props.history.push("/");
    } else {
      var queryString = this.props.location.search;
      var paramObj = new URLSearchParams(queryString);
      if (paramObj.get("tab") == null) {
        this.props.history.push("/admin?tab=user");
      }
      this.fetchUsers();
    }
  }
  fetchUsers = () => {
    axios
      .get(window.serverRoot + "api/users")
      .then((response) => {
        if (response.data.length > 0) {
          for (var user of response.data) {
            user["selected"] = false;
          }
          this.setState({ users: response.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  togglePanel = () => {
    this.setState({ sidePanelShow: !this.state.sidePanelShow });
  };
  toggleUserSelect = (index) => {
    var curUsers = this.state.users;
    curUsers[index].selected = !curUsers[index].selected;
    this.setState({ users: curUsers });
  };
  updateUsers = (statusToUpdate) => {
    var selectedUsers = this.state.users.filter(
      (user) => user.selected == true
    );
    if (selectedUsers.length == 0) {
      this.props.animator("Please select at least 1 User", "info");
    } else {
      axios
        .post(window.serverRoot + "api/updateUsers", {
          users: selectedUsers,
          status: statusToUpdate,
        })
        .then((response) => {
          console.log(response.data);
          var arr = JSON.parse(response.data.updatedUsers);
          if (response.status == 200 && arr.length > 0) {
            this.props.animator(
              "Successfully set " +
                arr.length +
                " users status to: " +
                statusToUpdate
            );
          }
          this.fetchUsers();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  deleteUsers = () => {
    var selectedUsers = this.state.users.filter(
      (user) => user.selected == true
    );
    if (selectedUsers.length == 0) {
      this.setState({deleteModalShow: false});
      this.props.animator("Please select at least 1 User", "info");
    } else {
      axios
        .post(window.serverRoot + "api/deleteUsers", {
          users: selectedUsers,
        })
        .then((response) => {
          var arr = JSON.parse(response.data.deletedUsers);
          if (response.status == 200 && arr.length > 0) {
            this.props.animator(
              "Successfully deleted " + arr.length + " users."
            );
            this.setState({deleteModalShow: false});
          }
          this.fetchUsers();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  render() {
    var queryString = this.props.location.search;
    var paramObj = new URLSearchParams(queryString);
    return (
      <div className="admin-container" style={{ marginTop: "65.96px" }}>
        <div
          className="admin-sidePanel"
          style={
            this.state.sidePanelShow ? { width: "250px" } : { width: "0px" }
          }
        >
          <span
            className="collapase-icon"
            style={
              this.state.sidePanelShow
                ? { right: "5px" }
                : { right: "-20px", color: "#434343" }
            }
            onClick={this.togglePanel}
          >
            <FontAwesomeIcon
              icon={this.state.sidePanelShow ? "chevron-left" : "chevron-right"}
            />
          </span>
          {this.state.sidePanelShow ? (
            <div className="panelItems">
              <div className="panel-title">
                Hi, admin {sessionStorage.getItem("user")}
              </div>
              <Link
                className={
                  paramObj.get("tab") === "user"
                    ? "itemLink active"
                    : "itemLink"
                }
                to="/admin?tab=user"
              >
                <FontAwesomeIcon
                  style={{ marginRight: "10px", fontSize: "17px" }}
                  icon="user"
                />
                Users
              </Link>
              <Link
                className={
                  paramObj.get("tab") === "test1"
                    ? "itemLink active"
                    : "itemLink"
                }
                to="/admin?tab=user"
              >
                <FontAwesomeIcon
                  style={{ marginRight: "10px", fontSize: "17px" }}
                  icon="ellipsis-h"
                />
                Comming Soon
              </Link>
              <Link
                className={
                  paramObj.get("tab") === "test1"
                    ? "itemLink active"
                    : "itemLink"
                }
                to="/admin?tab=user"
              >
                <FontAwesomeIcon
                  style={{ marginRight: "10px", fontSize: "17px" }}
                  icon="ellipsis-h"
                />
                Comming Soon
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="admin-content">
          <div className="action">
            <Button
              variant="light"
              onClick={() => {
                this.updateUsers("APPROVED");
              }}
            >
              Approve <FontAwesomeIcon icon="thumbs-up" />
            </Button>
            <Button
              variant="warning"
              style={{ marginLeft: "15px" }}
              onClick={() => {
                this.updateUsers("PENDING");
              }}
            >
              Reject <FontAwesomeIcon icon="times" />
            </Button>
            <Button
              variant="danger"
              style={{ marginLeft: "15px" }}
              onClick={() => {this.setState({deleteModalShow: true});}}
            >
              Delete <FontAwesomeIcon icon="trash-alt" />
            </Button>
          </div>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((user, index) => {
                var curIndex = index;
                return (
                  <tr
                    key={user.id}
                    onClick={() => {
                      this.toggleUserSelect(curIndex);
                    }}
                  >
                    <td>
                      <Form.Check
                        type="checkbox"
                        label={user.id}
                        id={user.id}
                        checked={user.selected}
                        onChange={() => {
                          this.toggleUserSelect(curIndex);
                        }}
                      />
                    </td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role == "Renter" ||
                      user.role == "Buyer" ||
                      user.role == "Admin"
                        ? "AVAILABLE"
                        : user.status}
                    </td>
                    <td>{user.time_created}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Modal show={this.state.deleteModalShow} onHide={()=>{this.setState({deleteModalShow: false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete these {this.state.users.filter((user) => user.selected == true).length} users?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>{this.setState({deleteModalShow: false});}}>
                Close
              </Button>
              <Button variant="danger" onClick={this.deleteUsers}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(Admin);
