import ApplicationForm from "./components/ApplicationForm";
// redux
// import { Provider } from "react-redux";
// // import store from "./store";


import Header from "./components/Header";
import Home from "./components/Home";
import Property from "./components/Property";
import About from "./components/About";
import Result from "./components/Result";
import Admin from "./components/Admin";
import PostProperties from "./components/PostProperties";
import ReviewApplications from "./components/ReviewApplications";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Favorites from "./components/Favorites";
import React, { Component } from "react";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animator: null,
    };
  }

  render() {
    return (
      <Router>
        <Header setAnimator={(inputAnimator) => { this.setState({ animator: inputAnimator }) }} />
        <Switch>
          <Route exact path="/">
            <Home animator={this.state.animator} />
          </Route>
          <Route exact path="/property">
            <Property animator={this.state.animator} />
          </Route>
          <Route exact path="/about">
            <About animator={this.state.animator} />
          </Route>
          <Route exact path="/application/apply">
            <ApplicationForm animator={this.state.animator} />
          </Route>
          <Route exact path="/result">
            <Result animator={this.state.animator} />
          </Route>
          <Route exact path="/admin">
            <Admin animator={this.state.animator}/>
          </Route>
          <Route exact path="/postProperties">
            <PostProperties animator={this.state.animator}/>
          </Route>
          <Route exact path="/review/applications">
            <ReviewApplications animator={this.state.animator} />
          </Route>
          <Route exact path="/myFavorites">
            <Favorites />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default App;