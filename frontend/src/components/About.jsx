import React, { Component } from "react";
import axios from "axios";
import "../test";
import "../config";
class About extends Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
        this.state = {
            imgs: [],
        }
    }   
  uploadProperties = () => {
    var manager = 1;
    var pTypes = ["apartment", "townHouse", "singleFamily", "detachedSingle"];
    var for_rent = [0, 1];
    var addr = window.addr;
    var properties = [];
    for (var addObj of addr) {
      var property = {};
      property["for_rent"] =
        for_rent[Math.floor(Math.random() * for_rent.length)];
      property["manager_id"] = 1;
      property["property_type"] =
        pTypes[Math.floor(Math.random() * pTypes.length)];
      property["zip_code"] = parseInt(addObj["zip"]);
      property["street"] = addObj["addr"];
      property["city"] = addObj["city"];
      property["state"] = "CA";
      property["country"] = "US";
      var features = {};

      var bed = Math.floor(Math.random() * 6);
      var bath = Math.min(Math.floor(Math.random() * 5) + 1, bed);

      var basicSqft = 300;
      var livingInc = Math.random() * 1.4;
      var sqft = basicSqft * (1 + livingInc);
      for (var i = 1; i <= bed; i++) {
        sqft += (Math.random() * 0.2 + 0.9) * 250;
      }
      features["bed"] = bed;
      features["bath"] = bath;
      features["sqft"] = Math.floor(sqft);
      features["is_carpet"] = [0, 1][Math.floor(Math.random() * 2)];
      features["open_parking"] = [0, 1][Math.floor(Math.random() * 2)];
      features["year_built"] =
        1900 + Math.floor(Math.random() * (2020 - 1900 + 1));
      features["gym"] = [0, 1][Math.floor(Math.random() * 2)];
      features["ac"] = [0, 1][Math.floor(Math.random() * 2)];
      features["open_date"] = new Date();
      property["listed_price"] =
        property["for_rent"] == 1
          ? Math.floor(1800 + Math.pow(bed, 0.85) * 330)
          : Math.floor((1500000 / 2700) * sqft + 500000);
      features["deposit"] =
        property["for_rent"] == 1 ? property["listed_price"] : 0;
      features["term"] =
        property["for_rent"] == 1 ? [3, 6, 12, 18, 24][Math.floor(Math.random() * 5)] : 0;
      property["features"] = features;
      properties.push(property);
    }
    var newProperty = new FormData();
    newProperty.append("properties", JSON.stringify(properties));
    
    axios
      .post(window.serverRoot + "api/property/importAll", newProperty, { headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => {
        console.log(response);
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
  };
  
 

  render() {
    return (
      <div>
        <h1> this is About pages </h1>
        <button
          style={{ position: "relative", top: "100px", zIndex: "9999" }}
          onClick={() => {
            this.uploadProperties();
          }}
        >
          toggle message on
        </button>
      </div>
    );
  }
}
export default About;
