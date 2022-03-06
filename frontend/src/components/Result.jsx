import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Form from "react-bootstrap/Form";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../css/result.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Card from "./Card";
import Pagination from "react-bootstrap/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../config";
class Result extends Component {
  constructor(props) {
    super(props);
    // dom refs
    this.bedSlider = React.createRef();
    this.bathSlider = React.createRef();
    this.priceSlider = React.createRef();
    this.yearSlider = React.createRef();
    this.areaSlider = React.createRef();

    // const boundary values / default
    this.bedMin = 0;
    this.bedMax = 5;
    this.bathMin = 1;
    this.bathMax = 5;
    this.rentMin = 1000;
    this.rentMax = 10000;
    this.priceMin = 100000;
    this.priceMax = 2000000;
    this.termMin = 3;
    this.termMax = 24;
    this.yearMin = 1970;
    this.yearMax = 2020;
    this.areaMin = 300;
    this.areaMax = 3000;
    this.pTypeDefault = ["1", "2", "3", "4"];
    this.floorDefault = ["1", "0"];
    this.parkingDefault = ["1", "0"];
    this.gymDefault = ["1", "0"];
    this.acDefault = ["1", "0"];

    var queryString = this.props.location.search;
    var paramObj = new URLSearchParams(queryString);

    var tempForRent = paramObj.get("rental") === null ? 0 : 1;
    this.state = {
      conditions: {
        for_rent: paramObj.get("rental") === null ? 0 : 1,
        zipOrCity:
          paramObj.get("zip") === null
            ? paramObj.get("city") === null
              ? ""
              : paramObj.get("city")
            : paramObj.get("zip"),
        minBed:
          paramObj.get("minBed") === null
            ? this.bedMin
            : parseInt(paramObj.get("minBed")),
        maxBed:
          paramObj.get("maxBed") === null
            ? this.bedMax
            : parseInt(paramObj.get("maxBed")),
        minBath:
          paramObj.get("minBath") === null
            ? this.bathMin
            : parseInt(paramObj.get("minBath")),
        maxBath:
          paramObj.get("maxBath") === null
            ? this.bathMax
            : parseInt(paramObj.get("maxBath")),
        minPrice:
          paramObj.get("minPrice") === null
            ? tempForRent === 1
              ? this.rentMin
              : this.priceMin
            : parseInt(paramObj.get("minPrice")),
        maxPrice:
          paramObj.get("maxPrice") === null
            ? tempForRent === 1
              ? this.rentMax
              : this.priceMax
            : parseInt(paramObj.get("maxPrice")),
        term:
          paramObj.get("term") === null
            ? this.termMax
            : parseInt(paramObj.get("term")),
        minYear:
          paramObj.get("minYear") === null
            ? this.yearMin
            : parseInt(paramObj.get("minYear")),
        maxYear:
          paramObj.get("maxYear") === null
            ? this.yearMax
            : parseInt(paramObj.get("maxYear")),
        minSqrt:
          paramObj.get("minSqrt") === null
            ? this.areaMin
            : parseInt(paramObj.get("minSqrt")),
        maxSqrt:
          paramObj.get("maxSqrt") === null
            ? this.areaMax
            : parseInt(paramObj.get("maxSqrt")),
        propertyType:
          paramObj.get("propertyType") === null
            ? this.pTypeDefault.concat()
            : paramObj.get("propertyType").split(","),
        floorType:
          paramObj.get("floor") === null
            ? this.floorDefault.concat()
            : paramObj.get("floor").split(","),
        parkingType:
          paramObj.get("parking") === null
            ? this.parkingDefault.concat()
            : paramObj.get("parking").split(","),
        gym:
          paramObj.get("gym") === null
            ? this.gymDefault.concat()
            : paramObj.get("gym").split(","),
        ac:
          paramObj.get("ac") === null
            ? this.acDefault.concat()
            : paramObj.get("ac").split(","),
      },
      plist: [],
      page: paramObj.get("p") === null ? 1 : parseInt(paramObj.get("p")),
      favModalShow: false,
      favSearchName: "",
      favorited: false,
    };
    this.postRequest(
      window.serverRoot + "api/property/query",
      this.generateJsonLogic(),
      this.searchOrRedoSearchSuccess
    );
  }
  componentDidMount() {
    console.log("did mount");
    this.updatefavorited();
  }
  componentDidUpdate(prevProps) {
  }
  postRequest = (url, input, successHandler) => {
    axios
      .post(url, input)
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

  setConditionAttribute = (name, value) => {
    var curConditions = this.state.conditions;
    curConditions[name] = value;
    this.setState({ conditions: curConditions });
  };

  handleRangeSlider = (name, value) => {
    var curConditions = this.state.conditions;
    curConditions["min" + name] = value[0];
    curConditions["max" + name] = value[1];
    this.setState({ conditions: curConditions });
  };

  removeExcessiveMark = (sliderDOM) => {
    var markers = sliderDOM.querySelectorAll(
      "span.MuiSlider-mark.MuiSlider-markActive"
    );
    var markersNum = sliderDOM.querySelectorAll(
      "span.MuiSlider-markLabel.MuiSlider-markLabelActive"
    );
    if (markers.length > 2) {
      var temp = markers[0];
      sliderDOM.removeChild(temp);
    }
    if (markersNum.length > 2) {
      var tempNum = markersNum[0];
      sliderDOM.removeChild(tempNum);
    }
  };

  handleForRent = (e) => {
    if (e.target.value === "Rental") {
      this.setConditionAttribute("for_rent", 1);
      this.setConditionAttribute("minPrice", this.rentMin);
      this.setConditionAttribute("maxPrice", this.rentMax);
    } else {
      this.setConditionAttribute("for_rent", 0);
      this.setConditionAttribute("minPrice", this.priceMin);
      this.setConditionAttribute("maxPrice", this.priceMax);
    }
  };

  generateJsonLogic = () => {
    var logic = {};
    var conditions = this.state.conditions;
    var query = [];
    if (conditions.for_rent === 1) {
      query.push({ "==": [{ var: "for_rent" }, 1] });
    } else {
      query.push({ "==": [{ var: "for_rent" }, 0] });
    }
    if (conditions.zipOrCity != null) {
      if (conditions.zipOrCity.trim().match(/^\d{5}$/)) {
        query.push({ "==": [{ var: "zip_code" }, conditions.zipOrCity] });
      }
      if (conditions.zipOrCity.trim().match(/^[a-zA-Z \.]+$/)) {
        query.push({ "==": [{ var: "city" }, conditions.zipOrCity] });
      }
    }
    if (conditions.minBed > this.bedMin) {
      query.push({ ">=": [{ var: "features.bed" }, conditions.minBed] });
    }
    if (conditions.maxBed < this.bedMax) {
      query.push({ "<=": [{ var: "features.bed" }, conditions.maxBed] });
    }
    if (conditions.minBath > this.bathMin) {
      query.push({ ">=": [{ var: "features.bath" }, conditions.minBath] });
    }
    if (conditions.maxBath < this.bathMax) {
      query.push({ "<=": [{ var: "features.bath" }, conditions.maxBath] });
    }
    if (
      conditions.minPrice >
      (this.state.conditions.for_rent === 1 ? this.rentMin : this.priceMin)
    ) {
      query.push({ ">=": [{ var: "listed_price" }, conditions.minPrice] });
    }
    if (
      conditions.maxPrice <
      (this.state.conditions.for_rent === 1 ? this.rentMax : this.priceMax)
    ) {
      query.push({ "<=": [{ var: "listed_price" }, conditions.maxPrice] });
    }
    if (conditions.for_rent === 1 && conditions.term < this.termMax) {
      query.push({ "<=": [{ var: "features.term" }, conditions.term] });
    }
    if (conditions.minYear > this.yearMin) {
      query.push({
        ">=": [{ var: "features.year_built" }, conditions.minYear],
      });
    }
    if (conditions.maxYear < this.yearMax) {
      query.push({
        "<=": [{ var: "features.year_built" }, conditions.maxYear],
      });
    }
    if (conditions.minSqrt > this.areaMin) {
      query.push({ ">=": [{ var: "features.sqft" }, conditions.minSqrt] });
    }
    if (conditions.maxSqrt < this.areaMax) {
      query.push({ "<=": [{ var: "features.sqft" }, conditions.maxSqrt] });
    }
    if (conditions.propertyType.length < this.pTypeDefault.length) {
      var pTypeMap = {
        1: "apartment",
        2: "townHouse",
        3: "singleFamily",
        4: "detachedSingle",
      };
      var mappedType = conditions.propertyType.map((current) => {
        return pTypeMap[current];
      });
      query.push({ in: [{ var: "property_type" }, mappedType] });
    }
    if (conditions.floorType.length < this.floorDefault.length) {
      query.push({
        in: [
          { var: "features.is_carpet" },
          conditions.floorType.map((current) => {
            return parseInt(current);
          }),
        ],
      });
    }
    if (conditions.parkingType.length < this.parkingDefault.length) {
      query.push({
        in: [
          { var: "features.open_parking" },
          conditions.parkingType.map((current) => {
            return parseInt(current);
          }),
        ],
      });
    }
    if (conditions.gym.length < this.gymDefault.length) {
      query.push({
        in: [
          { var: "features.gym" },
          conditions.gym.map((current) => {
            return parseInt(current);
          }),
        ],
      });
    }
    if (conditions.ac.length < this.acDefault.length) {
      query.push({
        in: [
          { var: "features.ac" },
          conditions.ac.map((current) => {
            return parseInt(current);
          }),
        ],
      });
    }
    logic["and"] = query;
    return logic;
  };
  generateQueryString = (page=1) => {
    var result = "?";
    var conditions = this.state.conditions;
    if (conditions.for_rent === 1) {
      result += result === "?" ? "" : "&";
      result += "rental=1";
    }
    if (conditions.zipOrCity.trim() != "") {
      if (conditions.zipOrCity.trim().match(/^\d{5}$/)) {
        result += result === "?" ? "" : "&";
        result += "zip=" + conditions.zipOrCity;
      } else if (conditions.zipOrCity.trim().match(/^[a-zA-Z \.]+$/)) {
        result += result === "?" ? "" : "&";
        result += "city=" + conditions.zipOrCity;
      }
    }
    if (conditions.minBed > this.bedMin) {
      result += result === "?" ? "" : "&";
      result += "minBed=" + conditions.minBed;
    }
    if (conditions.maxBed < this.bedMax) {
      result += result === "?" ? "" : "&";
      result += "maxBed=" + conditions.maxBed;
    }
    if (conditions.minBath > this.bathMin) {
      result += result === "?" ? "" : "&";
      result += "minBath=" + conditions.minBath;
    }
    if (conditions.maxBath < this.bathMax) {
      result += result === "?" ? "" : "&";
      result += "maxBath=" + conditions.maxBath;
    }
    if (
      conditions.minPrice >
      (this.state.conditions.for_rent === 1 ? this.rentMin : this.priceMin)
    ) {
      result += result === "?" ? "" : "&";
      result += "minPrice=" + conditions.minPrice;
    }
    if (
      conditions.maxPrice <
      (this.state.conditions.for_rent === 1 ? this.rentMax : this.priceMax)
    ) {
      result += result === "?" ? "" : "&";
      result += "maxPrice=" + conditions.maxPrice;
    }
    if (conditions.for_rent === 1 && conditions.term < this.termMax) {
      result += result === "?" ? "" : "&";
      result += "term=" + conditions.term;
    }
    if (conditions.minYear > this.yearMin) {
      result += result === "?" ? "" : "&";
      result += "minYear=" + conditions.minYear;
    }
    if (conditions.maxYear < this.yearMax) {
      result += result === "?" ? "" : "&";
      result += "maxYear=" + conditions.maxYear;
    }
    if (conditions.minSqrt > this.areaMin) {
      result += result === "?" ? "" : "&";
      result += "minSqrt=" + conditions.minSqrt;
    }
    if (conditions.maxSqrt < this.areaMax) {
      result += result === "?" ? "" : "&";
      result += "maxSqrt=" + conditions.maxSqrt;
    }
    if (conditions.propertyType.length < this.pTypeDefault.length) {
      result += result === "?" ? "" : "&";
      result += "propertyType=" + conditions.propertyType.sort().toString();
    }
    if (conditions.floorType.length < this.floorDefault.length) {
      result += result === "?" ? "" : "&";
      result += "floor=" + conditions.floorType.sort().toString();
    }
    if (conditions.parkingType.length < this.parkingDefault.length) {
      result += result === "?" ? "" : "&";
      result += "parking=" + conditions.parkingType.sort().toString();
    }
    if (conditions.gym.length < this.gymDefault.length) {
      result += result === "?" ? "" : "&";
      result += "gym=" + conditions.gym.sort().toString();
    }
    if (conditions.ac.length < this.acDefault.length) {
      result += result === "?" ? "" : "&";
      result += "ac=" + conditions.ac.sort().toString();
    }
    result += result === "?" ? "" : "&";
    result += "p=" + page;
    return result;
  };
  updatefavorited = () => {
    var user_id = sessionStorage.getItem("user_id");
    if (user_id != null) {
      axios.get(window.serverRoot+"api/user/"+ user_id +"/favSearches")
      .then((response)=>{
        var favSearches = JSON.parse(response.data.favSearches);
        var matched = false;
        console.log(favSearches);
        for(var search of favSearches) {
          var qs = search.queryStr.replace(/ /, "%20").trim();
          console.log(qs);
          var urlQs = this.props.location.search.replace(/ /, "%20").trim();
          console.log(urlQs);
          if(qs == urlQs && this.state.favorited === false) {  
            console.log("found, need to set favorited to true")
            matched = true;
            this.setState({favorited: true});
            console.log("after setting favorited to true:" + this.state.favorited);
            return;
          }
        }
        if (!matched && this.state.favorited === true) {    
          console.log("not found, need to set favorited to false"); 
          this.setState({favorited: false});
          console.log("after setting favorited to false:" + this.state.favorited);
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }
  }
  redoSearch = () => {
    this.setState({page: 1});
    var queryString = this.generateQueryString();
    var jsonLogic = this.generateJsonLogic();
    this.postRequest(
      window.serverRoot + "api/property/query",
      jsonLogic,
      this.searchOrRedoSearchSuccess
    );
    console.log("previous: " + this.props.location.search)
    this.props.history.push("/result" + queryString);
    this.updatefavorited();
  };
  searchOrRedoSearchSuccess = (response) => {
    if (response.status === 200 && response.statusText === "OK") {
      this.setState({ plist: response.data });
    }
  };
  formatBigNumber = (num) => {
    if (num / 1000 < 100) {
      return num;
    } else if (num / 1000 < 1000) {
      return (num / 1000).toString() + "k";
    } else {
      return (num / 1000000).toString() + "M";
    }
  };
  getSliderMark = (name) => {
    var minValue = this.state.conditions["min" + name];
    var maxValue = this.state.conditions["max" + name];
    return [
      { value: minValue, label: this.formatBigNumber(minValue) },
      { value: maxValue, label: this.formatBigNumber(maxValue) },
    ];
  };
  handleCheckbox = (name, e) => {
    var checked = e.target.checked;
    var value = e.target.value;
    var attrArray = this.state.conditions[name];
    if (checked) {
      attrArray.push(value);
    } else {
      if (attrArray.length > 1) {
        var index = attrArray.indexOf(value);
        attrArray.splice(index, 1);
      } else {
        this.props.animator("You should at least select 1 " + name, "warning");
      }
    }
    this.setConditionAttribute(name, attrArray);
  };

  changePage = (toPage)=> {
    var queryString = this.generateQueryString(toPage);
    this.props.history.push("/result" + queryString);
    this.setState({page: toPage});
  }
  handleFavorite = ()=> {
    if (sessionStorage.getItem("user") == null) {
      this.props.animator("You need to sign in first","warning");
    } else {
      this.setState({favModalShow:true});
    }
  }
  handleUnFavorite = ()=> {
    if (sessionStorage.getItem("user") == null) {
      this.props.animator("You need to sign in first","warning");
    } else {
      axios.put(window.serverRoot + "api/user/" + 
      sessionStorage.getItem("user_id") + 
      "/removeFavoriteSearch", 
        {"queryStr": this.props.location.search})
      .then((response)=>{
        var name = JSON.parse(response.data.deleted).name;
        if(name != null) {
          this.props.animator("Successfully unliked this search");
          this.setState({favorited: false})
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }
  }

  createNewFavSearch = (e)=> {
    e.preventDefault();
    if (this.state.favSearchName.trim() === "") {
      this.props.animator("Name cannot be empty!", "danger");
    } else {
      var requestObj = {name: this.state.favSearchName, queryStr: this.props.location.search};
      axios.put(window.serverRoot+"api/user/" + sessionStorage.getItem("user_id") + "/addFavSearch", requestObj)
      .then((response)=>{
        if (response.status === 200 && response.statusText === "OK") {
          this.props.animator("Sucessfully favorited this search!");
          this.setState({favModalShow: false});
          this.setState({favorited: true});
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
  render() {
    var perPage = 8;
    var beginIndex = (this.state.page - 1) * perPage;
    var endIndex = Math.min(beginIndex + perPage, this.state.plist.length);
    var plistThisPage = this.state.plist.slice(beginIndex, endIndex);
    var rowArray = Array.apply(
      null,
      Array(Math.ceil(plistThisPage.length / 2))
    ).map(() => {});
    var pages = [this.state.page];
    var left = this.state.page;
    var right = this.state.page;
    var totalPage = Math.ceil(this.state.plist.length / perPage);
    let pagiNum = 5;
    while (
      right - left < pagiNum - 1 &&
      (left - 1 > 0 || right + 1 <= totalPage)
    ) {
      if (left - 1 > 0) {
        left--;
        pages.unshift(left);
      }
      if (right + 1 <= totalPage) {
        right++;
        pages.push(right);
      }
    }
    
    return (
      <div className="result-content">
        <div className="leftPanel">
          <Form.Control
            as="select"
            value={this.state.conditions.for_rent === 1 ? "Rental" : "Sale"}
            onChange={(e) => {
              this.handleForRent(e);
            }}
          >
            <option>Rental</option>
            <option>Sale</option>
          </Form.Control>
          <Form.Control
            placeholder="Enter Zip Code or City"
            value={this.state.conditions.zipOrCity}
            style={{ marginTop: "4px" }}
            onChange={(e) => {
              this.setConditionAttribute("zipOrCity", e.target.value);
            }}
          ></Form.Control>

          <Typography id="be-slider" gutterBottom>
            Bedroom
          </Typography>
          <Slider
            value={[this.state.conditions.minBed, this.state.conditions.maxBed]}
            onChange={(e, value) => {
              this.setConditionAttribute("minBed", value[0]);
              this.setConditionAttribute("maxBed", value[1]);
            }}
            aria-labelledby="bed-slider"
            valueLabelDisplay="auto"
            step={1}
            marks={this.getSliderMark("Bed")}
            min={this.bedMin}
            max={this.bedMax}
            onChangeCommitted={() => {
              this.removeExcessiveMark(this.bedSlider.current);
            }}
            ref={this.bedSlider}
          />

          <Typography id="ba-slider" gutterBottom>
            Bathroom
          </Typography>
          <Slider
            value={[
              this.state.conditions.minBath,
              this.state.conditions.maxBath,
            ]}
            onChange={(e, value) => {
              this.setConditionAttribute("minBath", value[0]);
              this.setConditionAttribute("maxBath", value[1]);
            }}
            aria-labelledby="bath-slider"
            valueLabelDisplay="auto"
            step={1}
            marks={this.getSliderMark("Bath")}
            min={this.bathMin}
            max={this.bathMax}
            onChangeCommitted={() => {
              this.removeExcessiveMark(this.bathSlider.current);
            }}
            ref={this.bathSlider}
          />

          <Typography id="pr-slider" gutterBottom>
            {this.state.conditions.for_rent === 1
              ? "Rent Range"
              : "Price Range"}
          </Typography>
          <Slider
            value={[
              this.state.conditions.minPrice,
              this.state.conditions.maxPrice,
            ]}
            onChange={(e, value) => {
              this.setConditionAttribute("minPrice", value[0]);
              this.setConditionAttribute("maxPrice", value[1]);
            }}
            aria-labelledby="price-slider"
            valueLabelDisplay="auto"
            step={500}
            marks={this.getSliderMark("Price")}
            min={
              this.state.conditions.for_rent === 1
                ? this.rentMin
                : this.priceMin
            }
            max={
              this.state.conditions.for_rent === 1
                ? this.rentMax
                : this.priceMax
            }
            onChangeCommitted={() => {
              this.removeExcessiveMark(this.priceSlider.current);
            }}
            ref={this.priceSlider}
          />
          {this.state.conditions.for_rent === 1 ? (
            <>
              <Typography id="ye-slider" gutterBottom>
                Leasing Term (Months)
              </Typography>
              <Slider
                value={this.state.conditions.term}
                onChange={(e, value) => {
                  this.setConditionAttribute("term", value);
                }}
                aria-labelledby="term-slider"
                valueLabelDisplay="auto"
                step={3}
                marks={[
                  {
                    value: this.state.conditions.term,
                    label: this.state.conditions.term.toString(),
                  },
                ]}
                min={this.termMin}
                max={this.termMax}
              />
            </>
          ) : (
            <></>
          )}

          <Typography id="ye-slider" gutterBottom>
            Year Built
          </Typography>
          <Slider
            value={[
              this.state.conditions.minYear,
              this.state.conditions.maxYear,
            ]}
            onChange={(e, value) => {
              this.setConditionAttribute("minYear", value[0]);
              this.setConditionAttribute("maxYear", value[1]);
            }}
            aria-labelledby="year-slider"
            valueLabelDisplay="auto"
            step={10}
            marks={this.getSliderMark("Year")}
            min={this.yearMin}
            max={this.yearMax}
            onChangeCommitted={() => {
              this.removeExcessiveMark(this.yearSlider.current);
            }}
            ref={this.yearSlider}
          />

          <Typography id="sq-slider" gutterBottom>
            Sqft
          </Typography>
          <Slider
            value={[
              this.state.conditions.minSqrt,
              this.state.conditions.maxSqrt,
            ]}
            onChange={(e, value) => {
              this.setConditionAttribute("minSqrt", value[0]);
              this.setConditionAttribute("maxSqrt", value[1]);
            }}
            aria-labelledby="area-slider"
            valueLabelDisplay="auto"
            step={50}
            marks={this.getSliderMark("Sqrt")}
            min={this.areaMin}
            max={this.areaMax}
            onChangeCommitted={() => {
              this.removeExcessiveMark(this.areaSlider.current);
            }}
            ref={this.areaSlider}
          />

          <Typography id="pa-radio" gutterBottom>
            Property Type
          </Typography>
          <Form.Check
            type="checkbox"
            label="Apartment"
            id="Apartment"
            value="1"
            checked={this.state.conditions.propertyType.indexOf("1") > -1}
            onChange={(e) => {
              this.handleCheckbox("propertyType", e);
            }}
          />
          <Form.Check
            type="checkbox"
            label="Townhouse"
            id="Townhouse"
            value="2"
            checked={this.state.conditions.propertyType.indexOf("2") > -1}
            onChange={(e) => {
              this.handleCheckbox("propertyType", e);
            }}
          />
          <Form.Check
            type="checkbox"
            label="Single Family Home"
            id="Single Family Home"
            value="3"
            checked={this.state.conditions.propertyType.indexOf("3") > -1}
            onChange={(e) => {
              this.handleCheckbox("propertyType", e);
            }}
          />
          <Form.Check
            type="checkbox"
            label="Detached Single"
            id="Detached Single"
            value="4"
            checked={this.state.conditions.propertyType.indexOf("4") > -1}
            onChange={(e) => {
              this.handleCheckbox("propertyType", e);
            }}
          />

          <Typography id="fl-radio" gutterBottom style={{ marginTop: "8px" }}>
            Floor Type
          </Typography>
          <Row>
            <Col xs="4">
              <Form.Check
                type="checkbox"
                label="Carpet"
                id="Carpet"
                value="1"
                checked={this.state.conditions.floorType.indexOf("1") > -1}
                onChange={(e) => {
                  this.handleCheckbox("floorType", e);
                }}
              />
            </Col>
            <Col xs="8">
              <Form.Check
                type="checkbox"
                label="Wooden Floor"
                id="Wooden Floor"
                value="0"
                checked={this.state.conditions.floorType.indexOf("0") > -1}
                onChange={(e) => {
                  this.handleCheckbox("floorType", e);
                }}
              />
            </Col>
          </Row>
          <Typography id="pa-radio" gutterBottom style={{ marginTop: "8px" }}>
            Parking
          </Typography>
          <Row>
            <Col xs="4">
              <Form.Check
                type="checkbox"
                label="Open"
                id="Open"
                value="1"
                checked={this.state.conditions.parkingType.indexOf("1") > -1}
                onChange={(e) => {
                  this.handleCheckbox("parkingType", e);
                }}
              />
            </Col>
            <Col xs="8">
              <Form.Check
                type="checkbox"
                label="Closed"
                id="Closed"
                value="0"
                checked={this.state.conditions.parkingType.indexOf("0") > -1}
                onChange={(e) => {
                  this.handleCheckbox("parkingType", e);
                }}
              />
            </Col>
          </Row>

          <Typography
            id="other-check"
            gutterBottom
            style={{ marginTop: "8px" }}
          >
            Others
          </Typography>
          <Row>
            <Col>
              <Typography id="gym-check" gutterBottom>
                Gym
              </Typography>
              <Form.Check
                type="checkbox"
                label="Yes"
                id="Yes"
                value="1"
                checked={this.state.conditions.gym.indexOf("1") > -1}
                onChange={(e) => {
                  this.handleCheckbox("gym", e);
                }}
              />
              <Form.Check
                type="checkbox"
                label="No"
                id="No"
                value="0"
                checked={this.state.conditions.gym.indexOf("0") > -1}
                onChange={(e) => {
                  this.handleCheckbox("gym", e);
                }}
              />
            </Col>
            <Col>
              <Typography id="ac-check" gutterBottom>
                AC
              </Typography>
              <Form.Check
                type="checkbox"
                label="Yes "
                id="Yes "
                value="1"
                checked={this.state.conditions.ac.indexOf("1") > -1}
                onChange={(e) => {
                  this.handleCheckbox("ac", e);
                }}
              />
              <Form.Check
                type="checkbox"
                label="No "
                id="No "
                value="0"
                checked={this.state.conditions.ac.indexOf("0") > -1}
                onChange={(e) => {
                  this.handleCheckbox("ac", e);
                }}
              />
            </Col>
          </Row>

          <Button onClick={this.redoSearch} style={{ marginTop: "12px" }}>
            Redo Search
          </Button>
        </div>
        <div className="plist-content">
        <Modal
            style={{top:"25%"}}
            id="favSearchModal"
            show={this.state.favModalShow}
            onHide={() => {
              this.setState({ favModalShow: !this.state.favModalShow });
              this.setState({ favSearchName:""});
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Give this search a name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control defaultValue="" onChange={(e)=>{this.setState({favSearchName: e.target.value});}}>

              </Form.Control>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={(e) => {
                  this.setState({ favModalShow: !this.state.favModalShow });
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  this.createNewFavSearch(e);
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
        </Modal>
        { this.state.favorited === true ?
          <div className="fav-search">
            <span className="fav-container" 
                  onMouseOver={()=>{this.setState({mouseOnFav: true});}} 
                  onMouseLeave={()=>{this.setState({mouseOnFav: false});}}
                  onClick={()=>{this.handleUnFavorite()}}>
              <span style={{marginRight: "6px"}}>You've liked this search</span>
            <FontAwesomeIcon icon="heart" style={this.state.mouseOnFav? {color:"#f6f6f6"}:{color: "#e12626"}}/>
            </span>
          </div> :
          <div className="fav-search">
            <span className="fav-container" 
                  onMouseOver={()=>{this.setState({mouseOnFav: true});}} 
                  onMouseLeave={()=>{this.setState({mouseOnFav: false});}}
                  onClick={()=>{this.handleFavorite()}}>
              <span style={{marginRight: "6px"}}>Like this search</span>
            <FontAwesomeIcon icon="heart" style={this.state.mouseOnFav? {color:"#e12626"}:{color: "#f6f6f6"}}/>
            </span>
          </div>
        }
          <div className="list-container">
          {plistThisPage.length > 0 ? (
            rowArray.map((row, index) => (
              <Row key={index} style={{ padding: "10px 0px" }}>
                <Col lg="6">
                  <Card
                    key={plistThisPage[index * 2]["imgs"]}
                    property={plistThisPage[index * 2]}
                  ></Card>
                </Col>
                {2 * index + 1 < plistThisPage.length ? (
                  <Col lg="6">
                    <Card
                      key={plistThisPage[index * 2 + 1]["imgs"]}
                      property={plistThisPage[index * 2 + 1]}
                    ></Card>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            ))
          ) : (
            <div>Didn't find anything</div>
          )}
          </div>
          <Pagination className="pagination">
          { this.state.page == 1? <Pagination.First disabled /> : <Pagination.First onClick={(e)=> { e.preventDefault(); this.changePage(1)}} /> }
          { this.state.page == 1? <Pagination.Prev disabled/> : <Pagination.Prev onClick={(e)=>{e.preventDefault(); this.changePage(this.state.page - 1)}}/> }
            {pages.map((element) => {
              if (element == this.state.page) { 
                return <Pagination.Item active key={element}>{element}</Pagination.Item>
              } 
              return <Pagination.Item key={element}
                      onClick={(e)=>{e.preventDefault(); this.changePage(element)}}>
                        {element}</Pagination.Item>
            })}
          { this.state.page == Math.ceil(this.state.plist.length  / perPage) ? 
            <Pagination.Next disabled /> : 
            <Pagination.Next onClick={(e)=>{e.preventDefault(); this.changePage(this.state.page + 1)}}/> }
          { this.state.page == Math.ceil(this.state.plist.length  / perPage) ? 
            <Pagination.Last disabled /> : 
            <Pagination.Last onClick={(e)=>{e.preventDefault(); this.changePage(totalPage)}}/> }
          </Pagination>
        </div>
      </div>
    );
  }
}
export default withRouter(Result);
