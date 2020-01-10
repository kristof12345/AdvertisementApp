import React, { Component } from "react";

interface IProps {
  text: string;
}

class InfoText extends Component<IProps> {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-centered">
            <p>{this.props.text}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default InfoText;
