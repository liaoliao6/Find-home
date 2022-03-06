import React, { Component } from "react";
import landingBgd from "../img/logo3.png";
import "../css/landing.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {withRouter} from "react-router-dom";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rental: true,
      zip: "",
    };
  }
  generateQueryString = (zipOrCity) => {
    var result = "?";
    result += this.state.rental ? "rental=1" : "";
    result += result === "?" ? "" : "&";
    result += (zipOrCity === "zip" ? "zip=": "city=") + this.state.zip;
    return result;
  };
  searchSubmit = () => {
    if (this.state.zip.trim() === "") {
      this.props.animator("Please enter a Zip Code or City", "info");
    } else if (!this.state.zip.trim().match(/^\d{5}$/) && !this.state.zip.trim().match(/^[a-zA-Z \.]+$/)) {
      this.props.animator("Invalid input", "danger");
    } else {
      var queryString = "";
      if (this.state.zip.trim().match(/^\d{5}$/)) {
        queryString = this.generateQueryString("zip");
      } else {
        queryString = this.generateQueryString("city");
      }
      this.props.history.push("/result" + queryString+"&p=1");
    }  
  
  }
  render() {
    return (
      <div id="landing-img-bgd">
        <img src={landingBgd} id="slogan-logo" alt="company-logo"/>
        <h2 id="img-slogan">Your next sweet home is one search away</h2>
        <div id="home-search-container">
          <Form.Row>
            <Col sm={3}>
              <Form.Group>
              <Form.Control as="select" onChange={(e)=>{ this.setState({rental:e.target.value === "Rental"})}}>
                <option>Rental</option>
                <option>Sale</option>
              </Form.Control>
              </Form.Group>
            </Col>
            <Col>
            <Form.Group>
              <Form.Control placeholder="Zip Code or City" onChange={(e)=>{this.setState({zip:e.target.value})}}/>
              </Form.Group>
            </Col>
            <Col md={2} >
              <Button style={{width:"100%"}} onClick={this.searchSubmit}>Submit</Button>
            </Col>
          </Form.Row>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
