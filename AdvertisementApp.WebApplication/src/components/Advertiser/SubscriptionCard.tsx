import React, { Component } from "react";
import { SubscriptionModel } from "../../models/subscription/Subscription";
import Button from "react-bootstrap/Button";
import { Session, UserStatus } from "../../models/user/Session";

interface IProps {
  subscription: SubscriptionModel;
  session: Session;
  onSubscribeClicked: (subscription: SubscriptionModel) => void;
}

class SubscriptionCard extends Component<IProps> {
  render() {
    var subscription = this.props.subscription;
    return (
      <div className="plan col-12 col-sm-8 col-md-6 col-lg-5 col-xl-3">
        <header>
          <h4 className="plan-title">{subscription.name}</h4>
          <div className="plan-cost">
            <span className="plan-price">${subscription.price}</span>
            <span className="plan-type">
              /{subscription.durationInDays} days
            </span>
          </div>
        </header>
        <ul className="plan-features">
          <li>
            <i className="ion-checkmark"> </i>Create advertisements
          </li>
          <li>
            <i className="ion-checkmark"> </i>Upload multiple images
          </li>
          <li>
            <i className="ion-checkmark"> </i>
            {subscription.normalAdvertisementCount} normal advertisements
          </li>
          <li>
            <i className="ion-checkmark"> </i>
            {subscription.highlightedAdvertisementCount} highlighted
            advertisements
          </li>
          <li>
            <i className="ion-checkmark"> </i>
            {subscription.featuredAdvertisementCount} featured advertisements
          </li>
        </ul>
        {this.props.session &&
          this.props.session.status == UserStatus.LoggedIn && (
            <div>
              <Button
                variant="dark"
                onClick={() => this.props.onSubscribeClicked(subscription)}
              >
                Select Plan
              </Button>
            </div>
          )}
      </div>
    );
  }
}

export default SubscriptionCard;
