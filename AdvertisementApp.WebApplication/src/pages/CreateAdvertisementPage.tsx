import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { loginUser, getUserDetails } from "../redux/Users/UserActions";
import CreateAdvertisement from "../components/Advertiser/CreateAdvertisement";
import { Session, UserStatus } from "../models/user/Session";
import { createAdvertisement } from "../http/AdvertisementDataLoader";
import { CreateRequest } from "../models/advertisement/AdvertisementRequests";
import { Advertisement } from "../models/advertisement/AdvertisementDetailed";
import {
  getCategories,
  getDetails
} from "../redux/Advertisements/AdvertisementActions";
import { Subscription } from "../models/subscription/Subscription";
import { Category, Detail } from "../models/advertisement/Detail";
import Login from "../components/Common/UserManagement/Login";

interface IProps extends RouteComponentProps {
  loginUser: typeof loginUser;
  session: Session;
  getUserDetails: typeof getUserDetails;
  subscription: Subscription;
  getCategories: typeof getCategories;
  categories: Category[];
  getDetails: typeof getDetails;
  details: Detail[];
}

class CreateAdvertisementPage extends Component<IProps> {
  // Login
  private handleLogin = (request: LoginRequest) => {
    this.props.loginUser(request);
  };

  private async handleCreateClick(
    request: CreateRequest
  ): Promise<Advertisement> {
    return await createAdvertisement(request);
  }

  render() {
    if (this.props.session.status != UserStatus.LoggedIn) {
      return (
        <div className="page-container">
          <h1>New Advertisement Panel</h1>
          <p>Please log in to create a new advertisement</p>
          <Login
            onLoginClicked={this.handleLogin}
            error={this.props.session && this.props.session.error}
          />
        </div>
      );
    } else {
      return (
        <div className="page-container">
          <CreateAdvertisement
            session={this.props.session}
            onSubmitClicked={this.handleCreateClick}
            getUserDetails={this.props.getUserDetails}
            getCategories={this.props.getCategories}
            categories={this.props.categories}
            getDetails={this.props.getDetails}
            metaDetails={this.props.details}
            subscription={this.props.subscription}
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
    subscription: store.users.details,
    details: store.advertisements.details,
    categories: store.advertisements.categories
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (request: LoginRequest) => dispatch(loginUser(request)),
    getUserDetails: (name: string) => dispatch(getUserDetails(name)),
    getDetails: () => dispatch(getDetails()),
    getCategories: () => dispatch(getCategories())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAdvertisementPage);
