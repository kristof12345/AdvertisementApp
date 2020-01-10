import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { Advertisement } from "../models/advertisement/AdvertisementBasic";
import { getMyAdvertisements } from "../redux/Advertisements/AdvertisementActions";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { loginUser } from "../redux/Users/UserActions";
import MyAdvertisementsList from "../components/Advertiser/MyAdvertisementsList";
import { Session, UserStatus } from "../models/user/Session";
import { deleteAdvertisement } from "../http/AdvertisementDataLoader";
import Login from "../components/Common/UserManagement/Login";

interface IProps extends RouteComponentProps {
  getMyAdvertisements: typeof getMyAdvertisements;
  myAdvertisements: Advertisement[];
  loginUser: typeof loginUser;
  session: Session;
}

class MyAdvertisementsPage extends Component<IProps> {
  // Login
  private handleLogin = (request: LoginRequest) => {
    this.props.loginUser(request);
  };

  private async handleDeleteClick(id: number) {
    await deleteAdvertisement(id);
    this.props.getMyAdvertisements(this.props.session.username);
  }

  render() {
    if (this.props.session.status != UserStatus.LoggedIn) {
      return (
        <div className="page-container">
          <h1>My Advertisements Panel</h1>
          <p>Please log in to see your advertisements</p>
          <Login
            onLoginClicked={this.handleLogin}
            error={this.props.session && this.props.session.error}
          />
        </div>
      );
    } else
      return (
        <MyAdvertisementsList
          myAdvertisements={this.props.myAdvertisements}
          onDeleteClicked={this.handleDeleteClick}
          getMyAdvertisements={this.props.getMyAdvertisements}
          session={this.props.session}
        />
      );
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session,
    myAdvertisements: store.advertisements.myAdvertisements
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    getMyAdvertisements: (name: string) => dispatch(getMyAdvertisements(name)),
    loginUser: (request: LoginRequest) => dispatch(loginUser(request))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAdvertisementsPage);
