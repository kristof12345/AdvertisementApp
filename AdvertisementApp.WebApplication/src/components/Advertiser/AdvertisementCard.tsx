import React, { Component } from "react";
import { Advertisement } from "../../models/advertisement/AdvertisementBasic";
import { withRouter } from "react-router-dom";
import { baseUrl } from "../../http/SettingsDataLoader";
import Button from "react-bootstrap/Button";

interface IProps {
  advertisement: Advertisement;
  onDeleteClicked: (id: number) => void;
}

class AdvertisementCard extends Component<IProps> {
  private DetailsButton = withRouter(({ history }) => (
    <Button
      variant="outline-success"
      className="col-auto m-1"
      onClick={() => {
        history.push("/myadvertisements/" + this.props.advertisement.id);
      }}
    >
      Details
    </Button>
  ));

  private EditButton = withRouter(({ history }) => (
    <Button
      variant="outline-info"
      className="col-auto m-1"
      type="button"
      onClick={() => {
        history.push("/myadvertisements/" + this.props.advertisement.id + "/edit");
      }}
    >
      Edit
    </Button>
  ));

  private DeleteButton = () => (
    <Button
      variant="outline-danger"
      className="col-auto m-1"
      onClick={() => {
        if (this.props.advertisement.id != undefined) {
          this.props.onDeleteClicked(this.props.advertisement.id);
        }
      }}
    >
      Delete
    </Button>
  );

  render() {
    return (
      <div className="col-sm-6 col-md-4 col-lg-3">
        <div className="card m-2">
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
            <this.EditButton />
            <this.DeleteButton />
          </div>
        </div>
      </div>
    );
  }
}

export default AdvertisementCard;
