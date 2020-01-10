import React, { Component } from "react";
import { Advertisement } from "../../models/advertisement/AdvertisementDetailed";
import { baseUrl } from "../../http/SettingsDataLoader";
import Button from "react-bootstrap/Button";
import {
  enableAdvertisement,
  disableAdvertisement
} from "../../http/AdvertisementDataLoader";
import { Status } from "../../models/advertisement/AdvertisementEnums";

var renderImages = (images: string[], url: string) => {
  let items = [];
  for (let i = 0; i <= images.length - 1; i++) {
    items.push(
      <div key={i} className="col-sm-6 col-md-4 col-lg-3">
        <a className="lightbox" href={url + images[i]}>
          <img src={url + images[i]} />
        </a>
      </div>
    );
  }
  return items;
};

interface IProps {
  advertisement: Advertisement;
}

interface IState {
  enabled: boolean;
}

class AdvertisementAdminDetails extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { enabled: props.advertisement.status != Status.Disabled };
  }
  private createDetailsList = () => {
    let items = [];
    for (let i = 0; i <= this.props.advertisement.details.length - 1; i++) {
      items.push(
        <li key={i} value={i}>
          {this.props.advertisement.details[i].name +
            " : " +
            (this.props.advertisement.details[i].stringValue
              ? this.props.advertisement.details[i].stringValue
              : this.props.advertisement.details[i].numberValue)}
        </li>
      );
    }
    return items;
  };

  private handleDisable = async () => {
    await disableAdvertisement(this.props.advertisement.id);
    this.setState({ enabled: false });
  };

  private handleEnable = async () => {
    await enableAdvertisement(this.props.advertisement.id);
    this.setState({ enabled: true });
  };

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
              {this.state.enabled ? (
                <Button onClick={this.handleDisable} variant="danger">
                  Disable
                </Button>
              ) : (
                <Button onClick={this.handleEnable} variant="success">
                  Enable
                </Button>
              )}
            </div>
          </div>
          <div className="row mt-5">
            {renderImages(
              this.props.advertisement.imageList,
              baseUrl + "image/" + this.props.advertisement.userName + "/"
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AdvertisementAdminDetails;
