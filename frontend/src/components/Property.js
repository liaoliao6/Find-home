import React, { Component } from "react";
// import PROPERTY_DATA from "./temp_property_data"
import "../css/property.css";
import axios from "axios";
import "../config";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";
class Property extends Component {
  constructor(props) {
    super(props);

    // https://ui.dev/react-router-v4-query-strings/
    var queryString = this.props.location.search;
    var paramObj = new URLSearchParams(queryString);

    this.state = {
      property: {
        id: 3,
        status: "a",
        manager_id: 4,
        property_type: "townHouse",
        zip_code: 94538,
        street: "4631 Norwood Ter",
        city: "Fremont",
        state: "CA",
        country: "US",
        listed_price: 1000,
        features: {
          sqrt: 600,
          bed: 4,
          bath: 4,
          is_carpet: 1,
          open_parking: 1,
          year_built: 2003,
          gym: 1,
          ac: 1,
          open_date: "11-09-2019",
          deposit: 1200,
          term: 12,
        },
        for_rent: true,
        lease: "12 mos",
        imgs: "",
      },
      user: {},
      propertyID: paramObj.get("id"),
      userID: sessionStorage.getItem("user_id"),
      imgURL: "",
      mouseOnFav: false,
      likedTheProperty: false,
    };
  }
  updateUser = ()=> {
    if (sessionStorage.getItem("user_id") != null) {
      axios.get(window.serverRoot + "api/users?user_id=" + sessionStorage.getItem("user_id"))
      .then((userResponse)=>{
        this.setState({
          user: userResponse.data === null ? {} : userResponse.data,
        });
      });
    }
  }
  addFavoriteSuccess = (response) => {
    this.props.animator("Successfully liked this property!");
    this.setState({likedTheProperty: true});
    this.updateUser();
  };

  addFavorite = (e) => {
    if (sessionStorage.getItem("user_id") == null) {
      this.props.animator("You need to signin first", "warning");
    } else {
    var json_fav_houses = {};
    if (this.state.user.favorite_houses === null) {
      var array1 = [];
      array1.push(this.state.propertyID);
      json_fav_houses = array1;
    }
    if (this.state.user.favorite_houses !== null) {
      var array2 = this.state.user.favorite_houses;
      array2.push(this.state.propertyID);

      let uniqueIDs = [...new Set(array2)];
      json_fav_houses = uniqueIDs;
    }
    axios
      .put(window.serverRoot + "api/user/" + this.state.userID + "/update", {
        favorite_houses: json_fav_houses,
      })
      .then((response) => {this.addFavoriteSuccess(response)})
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
  }
  removeFavoriteSuccess = (response)=> {
    this.props.animator("Successfully unliked this property!");
    this.setState({likedTheProperty: false});
    this.updateUser();
  }
  removeFavorite = (e)=> {
    var curFavorites = this.state.user.favorite_houses;
    curFavorites = curFavorites.splice(this.state.propertyID, 1);
    console.log(curFavorites);
    axios
      .put(window.serverRoot + "api/user/" + this.state.userID + "/update", {
        favorite_houses: curFavorites,
      })
      .then((response) => {this.removeFavoriteSuccess(response)})
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

  async componentDidMount() {
    const [propertyResponse] = await Promise.all([
      axios.get(
        window.serverRoot + "api/properties?propertyID=" + this.state.propertyID
      ),
    ]);
    this.setState({
      property: propertyResponse.data,
    });
    this.updateImage();
    // if (this.state.user.favorite_houses === null)
    if (sessionStorage.getItem("user_id") != null) {
      const [userResponse] = await Promise.all([
        axios.get(window.serverRoot + "api/users?user_id=" + this.state.userID),
      ]);
      this.setState({
        user: userResponse.data === null ? {} : userResponse.data,
      });
    }
    var favHouses = this.state.user.favorite_houses == null ? [] : this.state.user.favorite_houses;
    var liked = favHouses.indexOf(this.state.propertyID) > -1;
    this.setState({
      likedTheProperty: liked,
    });
  }
  updateImage = () => {
    var input = {
      method: "flickr.photos.getSizes",
      api_key: window.flickrApi,
      photo_id: this.state.property.imgs[0],
    };
    axios
      .get(
        "https://www.flickr.com/services/rest/?api_key=" +
          input.api_key +
          "&method=" +
          input.method +
          "&photo_id=" +
          input.photo_id
      )
      .then((response) => {
        var parser = new DOMParser();
        var imgSizes = parser.parseFromString(response.data, "text/xml");
        var sizes = imgSizes.getElementsByTagName("sizes")[0];
        var sizeNodes = sizes.getElementsByTagName("size");
        var img = sizeNodes[sizeNodes.length - 2].getAttribute("source");
        this.setState({ imgURL: img });
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
  handleClickApply = (e) => {
    sessionStorage.setItem("property_id", this.state.property.id);
  };
  render() {
    var pTypeMap = {
      apartment: "Apartment",
      townHouse: "Townhouse",
      singleFamily: "Single Family Home",
      detachedSingle: "Detached Single Family",
    };
    var timestamp = Date.parse(this.state.property.features.open_date);
    var opendate = new Date(timestamp);
    var formatDate =
      opendate.getMonth() +
      1 +
      "/" +
      opendate.getDate() +
      "/" +
      opendate.getFullYear();
    var price = parseInt(this.state.property.listed_price);
    var deposit = parseInt(this.state.property.features.deposit);
    const formatPrice = (price) => {
      var formattedPrice = "";
      var priceStr = price.toString();
      var counter = 0;
      for (var i = priceStr.length - 1; i >= 0; i--) {
        if (counter == 3) {
          formattedPrice = "," + formattedPrice;
          counter = 0;
        }
        formattedPrice = priceStr[i] + formattedPrice;
        counter++;
      }
      return formattedPrice;
    };
    var formattedPrice = formatPrice(price);
    var formattedDeposit = formatPrice(deposit);
    return (
      <div className="property-item">
        <div className="container">
          <div className="details row" key={this.state.property.id}>
            <div className="col-lg-8">
              <div
                className="property-img"
                style={{ background: "url(" + this.state.imgURL + ")" }}
              ></div>
              <div className="imgToggler">
                <div></div>
                {this.state.likedTheProperty ? (
                  <div className="fav-house">
                    <span
                      className="fav-container"
                      onMouseOver={() => {
                        this.setState({ mouseOnFav: true });
                      }}
                      onMouseLeave={() => {
                        this.setState({ mouseOnFav: false });
                      }}
                      onClick={this.removeFavorite}
                    >
                      <span style={{ marginRight: "6px" }}>
                        You've liked this property
                      </span>
                      <FontAwesomeIcon
                        icon="heart"
                        style={
                          this.state.mouseOnFav
                            ? { color: "#f6f6f6" }
                            : { color: "#e12626" }
                        }
                      />
                    </span>
                  </div>
                ) : (
                  <div className="fav-house">
                    <span
                      className="fav-container"
                      onMouseOver={() => {
                        this.setState({ mouseOnFav: true });
                      }}
                      onMouseLeave={() => {
                        this.setState({ mouseOnFav: false });
                      }}
                      onClick={this.addFavorite}
                    >
                      <span style={{ marginRight: "6px" }}>
                        Like this property
                      </span>
                      <FontAwesomeIcon
                        icon="heart"
                        style={
                          this.state.mouseOnFav
                            ? { color: "#e12626" }
                            : { color: "#f6f6f6" }
                        }
                      />
                    </span>
                  </div>
                )}
              </div>
              <hr />
              <div className="right-text">
                <div className="price-info">
                  {this.state.property.for_rent === true ||
                  this.state.property.for_rent === 1 ? (
                    <div className="priceContainer">
                      <div>
                        <span className="price-number">${formattedPrice}</span>
                        <span className="price-decorator"> Monthly</span>
                      </div>
                      <div style={{ marginLeft: "20px" }}>
                        <span className="price-number">
                          {this.state.property.features.term}
                        </span>
                        <span className="price-decorator"> Months Minimum</span>
                      </div>
                      <div style={{ marginLeft: "20px" }}>
                        <span className="price-number">
                          ${formattedDeposit}
                        </span>
                        <span className="price-decorator"> Deposit</span>
                      </div>
                    </div>
                  ) : (
                    <div className="priceContainer">
                      <div>
                        <span className="price-decorator">For Sale: </span>
                        <span className="price-number">${formattedPrice}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="propertyType">
                  {pTypeMap[this.state.property.property_type]}
                </div>
                <div className="address-title">
                  <FontAwesomeIcon
                    icon="map-marker-alt"
                    style={{ marginRight: "6px" }}
                  />
                  <div>
                    {this.state.property.street}, {this.state.property.city},{" "}
                    {this.state.property.state} {this.state.property.zip_code},{" "}
                    {this.state.property.country}
                  </div>
                </div>
                <hr />
                <div className="features-info">
                  <div>
                    <FontAwesomeIcon
                      icon="expand-alt"
                      style={{ marginRight: "6px" }}
                    />
                    {this.state.property.features.sqft} Sqft
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon="bed"
                      style={{ marginRight: "6px" }}
                    />
                    {this.state.property.features.bed} Bedrooms
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon="bath"
                      style={{ marginRight: "6px" }}
                    />
                    {this.state.property.features.bath} Bathrooms
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon="shoe-prints"
                      style={{ marginRight: "6px" }}
                    />
                    {this.state.property.features.is_carpet == 1
                      ? "Carpet"
                      : "Hardwood"}{" "}
                    Floor
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon="car"
                      style={{ marginRight: "6px" }}
                    />
                    {this.state.property.features.open_parking == 1
                      ? "Open"
                      : "Closed"}{" "}
                    Parking
                  </div>
                  {this.state.property.features.gym == 1 ? (
                    <div>
                      <FontAwesomeIcon
                        icon="dumbbell"
                        style={{ marginRight: "6px" }}
                      />
                      Gym
                    </div>
                  ) : (
                    <></>
                  )}
                  {this.state.property.features.ac === 1 ? (
                    <div>
                      <FontAwesomeIcon
                        icon="wind"
                        style={
                          this.state.property.features.gym == 1
                            ? { marginRight: "6px", marginLeft: "16px" }
                            : { marginRight: "6px" }
                        }
                      />
                      AC
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <hr />
                <div className="otherInfo">
                  <div>
                    <FontAwesomeIcon
                      icon="paint-roller"
                      style={{ marginRight: "6px" }}
                    />{" "}
                    Built in: {this.state.property.features.year_built}
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <FontAwesomeIcon
                      icon="calendar-alt"
                      style={{ marginRight: "6px" }}
                    />{" "}
                    Open since: {formatDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <ApplicationForm for_rent={this.state.property.for_rent} 
                               user={this.state.user} 
                               property = {this.state.property} 
                               animator = {this.props.animator} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Property);
