import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../css/postProperties.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import Card from "./Card";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../config";
class PostProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postShow: false,
      postProperty: {
        manager_id: sessionStorage.getItem("user_id"),
        property_type: "apartment",
        street: "",
        city: "",
        zip_code: "",
        state: "",
        country: "US",
        for_rent:
          ["Admin", "Landlord"].indexOf(sessionStorage.getItem("role")) > -1
            ? 1
            : 0,
        listed_price: 0,
        features: {
          sqft: 0,
          bed: 0,
          bath: 0,
          is_carpet: 1,
          open_parking: 1,
          year_built: 0,
          gym: 1,
          ac: 1,
          open_date: new Date(),
          deposit: 0,
          term: 0,
        },
      },
      img: null,
      loggedUser: sessionStorage.getItem("user"),
      role: sessionStorage.getItem("role"),
      properties: null,
      applications: null,
    };
  }
  generatePropertiesLogic = ()=> {
    var userId = sessionStorage.getItem("user_id");
    return {"and": 
              [
                {"==":[{"var":"manager_id"}, userId]},
              ]
           };
  }
  componentDidMount() {
    if (sessionStorage.getItem("user_id") != null) {
      var propertiesLogic = this.generatePropertiesLogic();
      axios.post(window.serverRoot + "api/property/query", propertiesLogic)
      .then((response)=>{
          this.setState({properties: response.data});
      })
      .catch((error)=>{
          console.log(error);
      });
      axios.get(window.serverRoot + "api/applications/approver/" + sessionStorage.getItem("user_id"))
      .then((response)=> {
        this.setState({applications: response.data});
      })
      .catch((error)=> {
        console.log(error);
      })
    }
  }
  setPropertyAttribute = (name, value) => {
    var curProperty = this.state.postProperty;
    curProperty[name] = value;
    this.setState({
      postProperty: curProperty,
    });
  };
  setPropertyFeature = (name, value) => {
    var curProperty = this.state.postProperty;
    var curFeature = curProperty.features;
    curFeature[name] = value;
    curProperty.features = curFeature;
    this.setState({
      postProperty: curProperty,
    });
  };
  postRequest = (url, input, config = null, successHandler) => {
    axios
      .post(url, input, config)
      .then((response) => successHandler(response))
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
  createNewProperty = (e) => {
    e.preventDefault();
    var config = { headers: { "Content-Type": "multipart/form-data" } };
    var newProperty = new FormData();
    newProperty.append("property", JSON.stringify(this.state.postProperty));
    for (const file of this.state.img) {
      newProperty.append("imgs", file);
    }
    this.postRequest(
      window.serverRoot + "api/property/create",
      newProperty,
      config,
      this.postPropertySuccess
    );
  };
  postPropertySuccess = (response) => {
    console.log(response);
    this.setState({ postShow: !this.state.postShow });
    this.props.animator("Successfully created a property!")
  };
  approve = (applicationId)=> {
    this.updateApplication(applicationId, "APPROVED")
  }
  reject = (applicationId) => {
    this.updateApplication(applicationId, "REJECTED");
  }
  updateApplication = (applicationId, statusToUpdate) => {
    var url = "api/application/" + applicationId + "/" + (statusToUpdate == "APPROVED" ? "approve" : "reject");
    axios.get(window.serverRoot + url)
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
  render() {
    var forRentDisabled =
      ["Admin", "Realtor"].indexOf(this.state.role) > -1 ? false : true;
    return (
      <div className="container" id="content-container">
        <div className="heading-container">
          <h4>My Posts</h4>
          <Button
            onClick={() => {
              this.setState({ postShow: !this.state.postShow });
            }}
          >
            <FontAwesomeIcon style={{ marginRight: "4px" }} icon="plus" />
            New Property
          </Button>
          <Modal
            id="postProperty"
            show={this.state.postShow}
            onHide={() => {
              this.setState({ postShow: !this.state.postShow });
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Create a new property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Property Type</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        defaultValue={this.state.postProperty["property_type"]}
                        as="select"
                        onChange={(e) => {
                          this.setPropertyAttribute(
                            "property_type",
                            e.target.value
                          );
                        }}
                      >
                        <option value="apartment">Apartment</option>
                        <option value="townHouse">Town House</option>
                        <option value="singleFamily">Single Family Home</option>
                        <option value="detachedSingle">Detached Single</option>
                      </Form.Control>
                    </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        defaultValue={
                          this.state.postProperty["for_rent"] === 1 ? "1" : "0"
                        }
                        disabled={forRentDisabled}
                        title={
                          "You are a " +
                          this.state.role +
                          ", You " +
                          (forRentDisabled ? "can't" : "can") +
                          " change this"
                        }
                        onChange={(e) => {
                          this.setPropertyAttribute(
                            "for_rent",
                            e.target.value === "1" ? 1 : 0
                          );
                        }}
                      >
                        <option value="1">For Rental</option>
                        <option value="0">For Sale</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group style={{ marginBottom: "5px" }}>
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    defaultValue={this.state.postProperty["street"]}
                    onChange={(e) => {
                      this.setPropertyAttribute("street", e.target.value);
                    }}
                  ></Form.Control>
                </Form.Group>
                <Form.Group style={{ marginTop: "10px" }}>
                  <Row>
                    <Col>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        defaultValue={this.state.postProperty["city"]}
                        onChange={(e) => {
                          this.setPropertyAttribute("city", e.target.value);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col>
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        defaultValue={this.state.postProperty["zip_code"]}
                        onChange={(e) => {
                          this.setPropertyAttribute("zip_code", e.target.value);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        defaultValue={this.state.postProperty["state"]}
                        onChange={(e) => {
                          this.setPropertyAttribute("state", e.target.value);
                        }}
                      ></Form.Control>
                    </Col>
                  </Row>
                </Form.Group>
                <hr />
                <Form.Group>
                  <Row>
                    <Col xs="2">
                      <Form.Control
                        defaultValue={
                          this.state.postProperty.features.sqft === 0
                            ? ""
                            : this.state.postProperty.features.sqft
                        }
                        onChange={(e) => {
                          this.setPropertyFeature(
                            "sqft",
                            e.target.value===""?"":parseInt(e.target.value)
                          );
                        }}
                      ></Form.Control>
                    </Col>
                    <Col xs="1" style={{ padding: "0px" }}>
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-30%, -50%)",
                        }}
                      >
                        Sqft
                      </span>
                    </Col>
                    <Col xs="2">
                      <Form.Control
                        defaultValue={
                          this.state.postProperty.features.bed === 0
                            ? ""
                            : this.state.postProperty.features.bed
                        }
                        onChange={(e) => {
                          this.setPropertyFeature(
                            "bed",e.target.value===""?"":parseInt(e.target.value)
                          );
                        }}
                      ></Form.Control>
                    </Col>
                    <Col xs="1" style={{ padding: "0px" }}>
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-30%, -50%)",
                        }}
                      >
                        Beds
                      </span>
                    </Col>
                    <Col xs="2">
                      <Form.Control
                        defaultValue={
                          this.state.postProperty.features.bath === 0
                            ? ""
                            : this.state.postProperty.features.bath
                        }
                        onChange={(e) => {
                          this.setPropertyFeature(
                            "bath",
                            e.target.value===""?"":parseInt(e.target.value)
                          );
                        }}
                      ></Form.Control>
                    </Col>
                    <Col xs="1" style={{ padding: "0px" }}>
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-30%, -50%)",
                        }}
                      >
                        Baths
                      </span>
                    </Col>

                    <Col xs="2">
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "0px",
                          transform: "translateY(-50%)",
                        }}
                      >
                        $
                      </span>
                      <Form.Control
                        defaultValue={
                          this.state.postProperty.listed_price === 0
                            ? ""
                            : this.state.postProperty.listed_price
                        }
                        onChange={(e) => {
                          this.setPropertyAttribute(
                            "listed_price",
                            e.target.value=== ""?"":parseInt(e.target.value)
                          );
                        }}
                      ></Form.Control>
                    </Col>
                    <Col
                      xs="1"
                      style={{
                        display:
                          this.state.postProperty.for_rent === 1
                            ? "block"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-70%, -50%)",
                        }}
                      >
                        /mon
                      </span>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Row>
                    <Col xs="2" style={{ paddingRight: "0px" }}>
                      <Form.Label>Built in</Form.Label>
                      <Form.Control
                        placeholder="2006"
                        defaultValue={
                          this.state.postProperty.features["year_built"] === 0
                            ? ""
                            : this.state.postProperty.features["year_built"]
                        }
                        onChange={(e) => {
                          this.setPropertyFeature(
                            "year_built",
                            e.target.value===""?"":parseInt(e.target.value)
                          );
                        }}
                      ></Form.Control>
                    </Col>
                    {this.state.postProperty.for_rent === 1 ? (
                      <Col xs="3">
                        <Form.Label>Term (month)</Form.Label>
                        <Form.Control
                          defaultValue={
                            this.state.postProperty.features["term"] === 0
                              ? ""
                              : this.state.postProperty.features["term"]
                          }
                          onChange={(e) => {
                            this.setPropertyFeature(
                              "term",
                              e.target.value===""?"":parseInt(e.target.value)
                            );
                          }}
                          placeholder="12"
                        ></Form.Control>
                      </Col>
                    ) : (
                      <></>
                    )}
                    {this.state.postProperty.for_rent === 1 ? (
                      <Col xs="3" style={{ paddingRight: "0px" }}>
                        <Form.Label>Security Deposit</Form.Label>
                        <div style={{ position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              transform: "translate(-13px, -50%)",
                            }}
                          >
                            $
                          </span>
                          <Form.Control
                            defaultValue={
                              this.state.postProperty.features.deposit === 0
                                ? ""
                                : this.state.postProperty.features.deposit
                            }
                            onChange={(e) => {
                              this.setPropertyFeature(
                                "deposit",
                                e.target.value===""?"":parseInt(e.target.value)
                              );
                            }}
                          ></Form.Control>
                        </div>
                      </Col>
                    ) : (
                      <></>
                    )}
                    <Col xs="4">
                      <Form.Label>Open Date</Form.Label>
                      <DatePicker
                        selected={this.state.postProperty.features["open_date"]}
                        onChange={(date) => {
                          this.setPropertyFeature("open_date", date);
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Row>
                    <Col xs="3">
                      <Form.Label>Floor Type</Form.Label>
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.is_carpet === 1
                        }
                        onChange={() => {
                          this.setPropertyFeature("is_carpet", 1);
                        }}
                        type="radio"
                        label="Carpet"
                        name="is_carpet"
                        id="carpet"
                      />
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.is_carpet === 0
                        }
                        onChange={() => {
                          this.setPropertyFeature("is_carpet", 0);
                        }}
                        type="radio"
                        label="Wooden"
                        name="is_carpet"
                        id="wooden"
                      />
                    </Col>
                    <Col xs="3" style={{ padding: "0px" }}>
                      <Form.Label>Parking type</Form.Label>
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.open_parking === 1
                        }
                        onChange={() => {
                          this.setPropertyFeature("open_parking", 1);
                        }}
                        type="radio"
                        label="Open"
                        name="parking"
                        id="open"
                      />
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.open_parking === 0
                        }
                        onChange={() => {
                          this.setPropertyFeature("open_parking", 0);
                        }}
                        type="radio"
                        label="Closed"
                        name="parking"
                        id="closed"
                      />
                    </Col>
                    <Col xs="3">
                      <Form.Label>Gym</Form.Label>
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.gym === 1
                        }
                        onChange={() => {
                          this.setPropertyFeature("gym", 1);
                        }}
                        type="radio"
                        label="Yes"
                        name="gym"
                        id="yes"
                      />
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.gym === 0
                        }
                        onChange={() => {
                          this.setPropertyFeature("gym", 0);
                        }}
                        type="radio"
                        label="No"
                        name="gym"
                        id="no"
                      />
                    </Col>
                    <Col xs="3">
                      <Form.Label>AC</Form.Label>
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.ac === 1
                        }
                        type="radio"
                        label="Yes"
                        name="ac"
                        id="acyes"
                        onChange={() => {
                          this.setPropertyFeature("ac", 1);
                        }}
                      />
                      <Form.Check
                        defaultChecked={
                          this.state.postProperty.features.ac === 0
                        }
                        onChange={() => {
                          this.setPropertyFeature("ac", 0);
                        }}
                        type="radio"
                        label="No"
                        name="ac"
                        id="acno"
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Form.File
                    id="pic1"
                    label="Cover image"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      this.setState({ img: e.target.files });
                    }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={(e) => {
                  this.setState({ postShow: !this.state.postShow });
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  this.createNewProperty(e);
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div style={{width:"100%", marginTop: "20px", minWidth: "400px",display:"flex",flexDirection:"column", alignItems:"center"}}>
        {this.state.properties == null || this.state.properties.length == 0? 
          <></>
          :
          this.state.properties.map((property, index) => {
            var applsOfProperty = [];
            if (this.state.applications != null) {
              applsOfProperty = this.state.applications.filter(application => application.property_id == property.id);
            }
            return (
            <div key={property.id} style={{width:"100%", display:"flex", flexDirection:"column",alignItems:"center"}}>
              <div style={{width:"60%"}}>
            <Card key={property.id} property={property}>
            </Card>
            </div>
            <table style={{width:"80%", margin:"10px 0px"}}>
              {
                applsOfProperty.length == 0 ? <></> : 
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Credit Score</th>
                  <th>Employer Info</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              }
            {
              applsOfProperty.map((appls) => {
                
                return( appls.status=="PENDING" ?
                <tr key={appls.id}>
                  <td>{appls.first_name}</td>
                  <td>{appls.last_name}</td>
                  <td>{appls.application_info.credit_score}</td>
                  <td>{appls.application_info.employment_info}</td>
                  <td>{appls.status}</td>
                  <td>
                    <div>
                    <Button variant="secondary" onClick={()=>{this.approve(appls.id)}}>Approve
                      <FontAwesomeIcon icon="thumbs-up" style={{marginLeft:"5px"}} />
                    </Button>
                    </div>
                    <div>
                    <Button variant="warning" onClick={()=>{this.reject(appls.id)}} style={{marginTop:"3px"}}>Reject
                    <FontAwesomeIcon icon="times" style={{marginLeft:"5px"}}/>
                    </Button>
                    </div>
                  </td>
                </tr> : <></>
                )
                }
              )
            }
            </table>
            </div>
            )
          }
          )
        }
        </div>
      </div>
    );
  }
}
export default withRouter(PostProperties);
