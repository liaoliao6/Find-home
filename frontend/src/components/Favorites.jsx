import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import "../config";
import "../css/favorites.css";
import Card from "./Card";
class Favorites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            properties: null,
        };
    }
    componentDidMount() {
        if (sessionStorage.getItem("user_id") != null) {
            axios.get(window.serverRoot + "api/users?user_id=" + sessionStorage.getItem("user_id"))
            .then((userResponse)=>{
              this.setState({
                user: userResponse.data === null ? {} : userResponse.data,
              });
            });
        }
    }
    generateJsonLogic = (ids) => {
        var jsonLogic = {};
        var query = [];
        for (var id of ids) {
            query.push({"==": [{"var":"id"}, id]});
        }
        jsonLogic["or"] = query;
        return jsonLogic;
    }
    render() {
        var searchStr = this.state.user.favorite_search;
        var searches = [];
        var houseCards = [];
        if (searchStr != null) {
            searches = JSON.parse(searchStr);
        }
        if (this.state.user != null && this.state.properties == null) {
            var houses = this.state.user.favorite_houses == null ? [] : this.state.user.favorite_houses;
            if (houses.length > 0) {
                var logic = this.generateJsonLogic(houses);
                axios.post(window.serverRoot + "api/property/query", logic)
                .then((response)=>{
                    this.setState({properties: response.data});
                })
                .catch((error)=>{
                    console.log(error);
                });
            }
        }
            
        return(
        <div className="container" id="content-container">
            <div className="row" style={{width: "100%", marginTop: "45px"}}>
                <div className="col-md-6 searches" >
                    <h3 style={{textAlign:"center", fontSize:"23px", marginBottom: "20px"}}>My Favorites Searches</h3>
                    {searches.map(
                        (search, index) => 
                    <div key={index} className="search-link-container">
                        <Link to= {"/result" + search.queryStr} >{search["name"]} {">>"} </Link>
                    </div>
                    )}
                </div>
                <div className="col-md-6" >
                    <h3 style={{textAlign:"center", fontSize:"23px",marginBottom: "20px"}}>My Favorites Properties</h3>
                    {
                    this.state.properties == null ? <></>:
                    this.state.properties.map(
                        (property, index) =>
                        <Card property={property}> 
                        </Card>                      
                    )
                    }
                </div>
            </div>
        </div>);
    }
}
export default withRouter(Favorites);