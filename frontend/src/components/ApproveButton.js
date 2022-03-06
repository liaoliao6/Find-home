import React, { Component } from 'react';



class ApproveButton extends React.Component {
  constructor() {
    super();
    this.state = {
      name: " "
    };
    this.onValueChange = this.onValueChange.bind(this);
  
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value
    });
  }


  render() {
    return (
      <form>
        
          <label>
            <input
              type="radio"
              value="Approve"
              checked={this.state.selectedOption === "Approve"}
              onChange={this.onValueChange}
            />
            Approve
          </label>
        
          <label>
            <input
              type="radio"
              value="Reject"
              checked={this.state.selectedOption === "Reject"}
              onChange={this.onValueChange}
            />
            Reject
          </label>
        
          <label>
            <input
              type="radio"
              value="Pending"
              checked={this.state.selectedOption === "Pending"}
              onChange={this.onValueChange}
            />
            Pending
          </label>
        
      </form>
    );
  }
}


export default ApproveButton;