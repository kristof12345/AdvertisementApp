import React, { Component } from "react";
import { Advertisement } from "../../models/advertisement/AdvertisementDetailed";
import { baseUrl } from "../../http/SettingsDataLoader";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";

interface IProps {
  advertisement: Advertisement;
  onDeleteClicked: (id: number) => Promise<string>;
}

class AdvertisementDetails extends Component<IProps> {
  private createDetailsList = () => {
    let items = [];
    for (let i = 0; i <= this.props.advertisement.details.length - 1; i++) {
      items.push(
        <li key={i} value={i}>
          {this.props.advertisement.details[i].name +
            " : " +
            (this.props.advertisement.details[i].type == 1
              ? this.props.advertisement.details[i].numberValue
              : this.props.advertisement.details[i].stringValue)}
        </li>
      );
    }
    return items;
  };

  private renderImages = () => {
    let items = [];
    var images = this.props.advertisement.imageList;
    for (let i = 0; i <= images.length - 1; i++) {
      items.push(
        <div key={i} className="col-sm-6 col-md-4 col-lg-3">
          <a
            className="lightbox"
            href={
              baseUrl +
              "image/" +
              this.props.advertisement.userName +
              "/" +
              images[i]
            }
          >
            <img
              src={
                baseUrl +
                "image/" +
                this.props.advertisement.userName +
                "/" +
                images[i]
              }
            />
          </a>
        </div>
      );
    }
    return items;
  };

  private EditButton = withRouter(({ history }) => (
    <Button
      variant="outline-info"
      className="col-3 m-1"
      type="button"
      onClick={() => {
        history.push(
          "/myadvertisements/" + this.props.advertisement.id + "/edit"
        );
      }}
    >
      Edit
    </Button>
  ));

  private DeleteButton = withRouter(({ history }) => (
    <Button
      variant="outline-danger"
      className="col-3 m-1"
      onClick={() => {
        if (this.props.advertisement.id != undefined) {
          this.props.onDeleteClicked(this.props.advertisement.id).then(() => {
            history.push("/myadvertisements");
          });
        }
      }}
    >
      Delete
    </Button>
  ));

  render() {
    return (
      <div>
        <div className="gallery">
          <h1 className="my-4">{this.props.advertisement.title}</h1>
          <div className="row">
            <div className="col-md-8">
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
            </div>

            <div className="col-md-4">
              <h3 className="my-3">Price: {this.props.advertisement.price} Ft</h3>
              <h3 className="my-3">Description</h3>
              <p>{this.props.advertisement.description}</p>
              <h3 className="my-3">Details</h3>
              <ul>{this.createDetailsList()}</ul>
              <h3 className="my-3">Contact</h3>
              <ul>
                <li>Phone: {this.props.advertisement.user.phoneNumber}</li>
                <li>Email: {this.props.advertisement.user.email}</li>
              </ul>
              <this.EditButton />
              <this.DeleteButton />
            </div>
          </div>
          <div className="row mt-5">{this.renderImages()}</div>
        </div>
      </div>
    );
  }
}

export default AdvertisementDetails;
