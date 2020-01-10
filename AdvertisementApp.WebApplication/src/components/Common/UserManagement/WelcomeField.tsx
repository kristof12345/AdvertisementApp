import React, { Component } from "react";

interface IProps{
  username: string;
}

class WelcomeField extends Component<IProps> {
  render() {
    return (
      <div>
        <div className="container">
          <h1 className="display-4 text-center">Welcome {this.props.username} !</h1>
          <p className="lead text-center">
            Start searching, or create a new advertisement.
          </p>
        </div>
      </div>
    );
  }
}

export default WelcomeField;
