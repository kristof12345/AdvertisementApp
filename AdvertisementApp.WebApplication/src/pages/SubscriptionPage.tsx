import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import {
  loginUser,
  loadSubscriptions,
  getUserDetails
} from "../redux/Users/UserActions";
import { Session, UserStatus } from "../models/user/Session";
import Login from "../components/Common/UserManagement/Login";
import SubscriptionsTable from "../components/Advertiser/SubscriptionsTable";
import {
  SubscriptionModel,
  Subscription
} from "../models/subscription/Subscription";
import { sendSubscription } from "../http/SubscriptionDataLoader";
import SubscriptionDetails from "../components/Advertiser/SubscriptionDetails";

interface IProps extends RouteComponentProps {
  loginUser: typeof loginUser;
  session: Session;
  userDetails: Subscription;
  subscriptions: SubscriptionModel[];
  loadSubscriptions: typeof loadSubscriptions;
  getUserDetails: typeof getUserDetails;
}

class SubscriptionPage extends Component<IProps> {
  subscriptionSelected = async (selected: SubscriptionModel) => {
    if (this.props.session.status == UserStatus.LoggedIn) {
      var request = { subscription: selected };
      await sendSubscription(request);
    }
    await this.props.getUserDetails(this.props.session.username);
  };

  public componentDidMount() {
    this.props.loadSubscriptions();
  }

  private handleLogin = (request: LoginRequest) => {
    this.props.loginUser(request);
  };

  render() {
    if (this.props.session.status != UserStatus.LoggedIn) {
      return (
        <div className="page-container">
          <h1>Subscriptions Panel</h1>
          <Login
            onLoginClicked={this.handleLogin}
            error={this.props.session && this.props.session.error}
          />
          <SubscriptionsTable
            session={this.props.session}
            content={this.props.subscriptions}
            onSubscribeClicked={this.subscriptionSelected}
          />
        </div>
      );
    } else {
      return (
        <div>
          <SubscriptionDetails
            getUserDetails={this.props.getUserDetails}
            subscription={this.props.userDetails}
            session={this.props.session}
          />
          <SubscriptionsTable
            session={this.props.session}
            content={this.props.subscriptions}
            onSubscribeClicked={this.subscriptionSelected}
          />
        </div>
      );
    }
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session || undefined,
    userDetails: store.users.details,
    subscriptions: store.users.subscriptions
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loadSubscriptions: () => dispatch(loadSubscriptions()),
    getUserDetails: (name: string) => dispatch(getUserDetails(name)),
    loginUser: (request: LoginRequest) => dispatch(loginUser(request))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionPage);
