import React, { Component } from "react";
import { Advertisement } from "../../models/advertisement/AdvertisementBasic";
import { withRouter } from "react-router-dom";
import { baseUrl } from "../../http/SettingsDataLoader";
import Button from "react-bootstrap/Button";
import { Status } from "../../models/advertisement/AdvertisementEnums";

interface IProps {
  advertisement: Advertisement;
}

class AdvertisementCard extends Component<IProps> {

  private DetailsButton = withRouter(({ history }) => (
    <Button
      variant="outline-success"
      onClick={() => {
        history.push("/advertisements/" + this.props.advertisement.id);
      }}
    >
      Details
    </Button>
  ));

  private Style() {
    var status = this.props.advertisement.status;
    if (status == Status.Highlighted || status == Status.Featured) return "card highlighted m-2";
    else return "card m-2";
  }

  render() {
    return (
      <div className="col-sm-6 col-md-4 col-lg-3">
        <div className={this.Style()}>
          <img
            src={
              baseUrl +
              "image/" +
              this.props.advertisement.userName +
              "/" +
              this.props.advertisement.image
            }
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{this.props.advertisement.title}</h5>
            <p className="card-text">{this.props.advertisement.description}</p>
            <p className="card-text">
              {this.props.advertisement.price + " Ft"}
            </p>
            <this.DetailsButton />
          </div>
        </div>
      </div>
    );
  }
}

export default AdvertisementCard;
