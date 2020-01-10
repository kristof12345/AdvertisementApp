import React, { Component } from "react";
import { Session, UserStatus } from "../../../models/user/Session";

interface IProps {
  name: string;
  onNameChange: (name: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  onLoginClicked: () => void;
  session: Session;
}

class LoginMenu extends Component<IProps> {
  private handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onNameChange(e.currentTarget.value);
  };

  private handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onPasswordChange(e.currentTarget.value);
  };

  private handleClick = () => {
    this.props.onLoginClicked();
  };

  render() {
    if (this.props.session.status == UserStatus.LoggedIn) {
      return (
        <div className="navbar-brand text-light">
          {"Welcome " + this.props.session.username + "!"}
        </div>
      );
    } else {
      return (
        <form className="form-inline d-none d-md-inline">
          <div className="form-group">
            <div className="col-xs-6">
              <input
                value={this.props.name}
                onChange={this.handleNameChange}
                className="form-control mr-sm-2 m-0"
                type="text"
                placeholder="Username"
                aria-label="Username"
              />
              <input
                value={this.props.password}
                onChange={this.handlePasswordChange}
                className="form-control mr-sm-2 m-0"
                type="password"
                placeholder="Password"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={this.handleClick}
                className="form-control mr-sm-2 btn btn-outline-success my-2 my-sm-0"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      );
    }
  }
}

export default LoginMenu;
