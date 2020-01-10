import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { loginUser, loadSubscriptions } from "../redux/Users/UserActions";
import ChangePasswordField from "../components/Common/UserManagement/ChangePasswordField";
import { Session, UserStatus } from "../models/user/Session";
import DeleteAccountField from "../components/Common/UserManagement/DeleteAccountField";
import { changePassword, deleteUser } from "../http/UserDataLoader";
import { SubscriptionModel } from "../models/subscription/Subscription";
import Login from "../components/Common/UserManagement/Login";

interface IProps extends RouteComponentProps {
  loginUser: typeof loginUser;
  session: Session;
  subscriptions: SubscriptionModel[];
  loadSubscriptions: typeof loadSubscriptions;
}

interface IState {
  oldPassword: string;
  newPassword: string;
  password: string;
}

class UserSettingsPage extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      password: ""
    };
  }

  // Login
  private handleLogin = (request: LoginRequest) => {
    this.props.loginUser(request);
  };

  // Change password
  private handleOldPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ oldPassword: e.target.value });
  };

  private handleNewPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPassword: e.target.value });
  };

  private handleApply = () => {
    var request = {
      userName: this.props.session.username,
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    };
    changePassword(request);
  };

  // Delete user
  private handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  private handleDelete = () => {
    deleteUser(this.props.session.username);
  };

  render() {
    if (this.props.session.status != UserStatus.LoggedIn) {
      return (
        <div className="page-container">
          <h1>MyEstates Panel</h1>
          <p>You should only be here if you have logged in</p>
          <Login
            onLoginClicked={this.handleLogin}
            error={this.props.session && this.props.session.error}
          />
        </div>
      );
    } else {
      return (
        <div className="page-container">
          <ChangePasswordField
            oldPass={this.state.oldPassword}
            onOldChange={this.handleOldPassChange}
            newPass={this.state.newPassword}
            onNewChange={this.handleNewPassChange}
            onApplyClicked={this.handleApply}
          />
          <DeleteAccountField
            password={this.state.password}
            onPasswordChange={this.handlePasswordChange}
            onDeleteClicked={this.handleDelete}
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
    subscriptions: store.users.subscriptions
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loadSubscriptions: () => dispatch(loadSubscriptions()),
    loginUser: (request: LoginRequest) => dispatch(loginUser(request))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettingsPage);
