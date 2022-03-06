import React, { Component } from "react";
import "../css/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../config";
import {Link} from "react-router-dom";
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgURL: "",
    };
    this.updateImage();
  }
  // componentWillReceiveProps(){

  // }
  updateImage = ()=> {
    var input = {
      method: "flickr.photos.getSizes",
      api_key: window.flickrApi,
      photo_id: this.props.property.imgs[0],
    }
    axios
    .get("https://www.flickr.com/services/rest/?api_key="
        +input.api_key+"&method="+input.method+"&photo_id="+input.photo_id)
    .then((response) => {
      var parser = new DOMParser();
      var imgSizes = parser.parseFromString(response.data, "text/xml");
      var sizes = imgSizes.getElementsByTagName("sizes")[0];
      var sizeNodes = sizes.getElementsByTagName("size");
      var img = sizeNodes[4].getAttribute("source");
      this.setState({imgURL: img});
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log("Error", error.message);
      }
    });
  }
  
  render() {
    const typeMap = {
      "apartment": "Apartment",
      "townHouse": "Townhouse",
      "singleFamily": "Single Family Home",
      "detachedSingle": "Detached Single Family",
    }
    return (
      <div className="card-container">
        <div className="img-container" style={

          {background: "url('"+ this.state.imgURL +"')"}
          }>
        </div>
        <div className="info-container">
          <div className="for_rent">For {this.props.property.for_rent == 1 ? "Rent" : "Sale"}<Link to={"/property?id="+this.props.property.id} className="property-link">Check Details</Link></div>
          <div className="ptype">{typeMap[this.props.property.property_type]}</div>
          <div className="price"><span style={{color:"#005da8"}}>${this.props.property.listed_price}</span> <span className="permonth">{this.props.property.for_rent == 1 ? "/ Per Month" : ""}</span></div>        
        <div className="address"></div>
          <div className="location">
            <FontAwesomeIcon icon="map-marker-alt" style={{marginRight: "6px"}}/>{this.props.property.street} {this.props.property.city}, {this.props.property.state}
          </div>  
          <div className="amenties">
        <div>{this.props.property.features.bed} <span style={{color: "grey"}}>Beds</span></div>
            <div style={{marginLeft: "5px"}}>{this.props.property.features.bath} <span style={{color: "grey"}}>Baths</span></div>
            <div style={{marginLeft: "5px"}}>{this.props.property.features.sqft} <span style={{color: "grey"}}>Sqft</span></div>
          </div>  
        </div>
      </div>
    );
  }
}

export default Card;
