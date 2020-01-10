import React, { Component } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionModel } from "../../models/subscription/Subscription";
import { Session } from "../../models/user/Session";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface IProps {
  content: SubscriptionModel[];
  session: Session;
  onSubscribeClicked: (subscription: SubscriptionModel) => void;
}

class SubscriptionsTable extends Component<IProps> {
  render() {
    return (
        <Row>
          <Col>
            <div
              className="labeled-form"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <div className="form-title">
                <p>Select subscription</p>
              </div>
              <div className="subscriptions">
                {this.props.content.map(s => (
                  <SubscriptionCard
                    session={this.props.session}
                    key={s.id}
                    subscription={s}
                    onSubscribeClicked={this.props.onSubscribeClicked}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>
    );
  }
}

export default SubscriptionsTable;
