import React, { Component } from "react";

class Logo extends Component {
  render() {
    return (
      <div className="navbar-brand">
        <img
          src="/Logo/real-estate-logo.png"
          height="30"
          className="d-inline-block align-top"
        />
        My Real Estates
      </div>
    );
  }
}

export default Logo;
