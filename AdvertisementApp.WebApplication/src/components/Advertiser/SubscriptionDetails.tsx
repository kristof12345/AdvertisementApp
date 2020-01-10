import React, { Component } from "react";
import { getUserDetails } from "../../redux/Users/UserActions";
import { Session } from "../../models/user/Session";
import { Subscription } from "../../models/subscription/Subscription";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface IProps {
  session: Session;
  getUserDetails: typeof getUserDetails;
  subscription: Subscription;
}

class SubscriptionDetails extends Component<IProps> {
  public componentDidMount() {
    this.props.getUserDetails(this.props.session.username);
  }

  render() {
    var subscription = this.props.subscription;
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>My subscription details</p>
              </div>
              <p>Subscription name: {subscription.model.name}</p>
              <p>
                Expiry date:
                {" " +
                  new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit"
                  }).format(subscription.expiryDate)}
              </p>
              <p>
                Available normal advertisement upload count:{" "}
                {subscription.remainingNormalAdvertisementCount}
              </p>
              <p>
                Available highlighted advertisement upload count:{" "}
                {subscription.remainingHighlightedAdvertisementCount}
              </p>
              <p>
                Available featured advertisement upload count:{" "}
                {subscription.remainingFeaturedAdvertisementCount}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SubscriptionDetails;
