import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Logo from "./Logo";
import Login from "./LoginMenu";
import { Session, UserType } from "../../../models/user/Session";
import { LoginRequest } from "../../../models/user/UserRequests";
import { IApplicationState } from "../../../redux/Store";
import { loginUser } from "../../../redux/Users/UserActions";

interface IProps extends RouteComponentProps {
  loginUser: typeof loginUser;
  session: Session;
}

interface IState {
  name: string;
  password: string;
}

class MenuBar extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      name: "",
      password: ""
    };
  }

  private handleNameChange = (name: string) => {
    this.setState({ name });
  };

  private handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  private handleLogin = () => {
    var request = { userName: this.state.name, password: this.state.password };
    this.props.loginUser(request);
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="xl">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/advertisements" className="nav-link">
              Advertisements
            </Link>
            <Link to="/myadvertisements" className="nav-link">
              My Advertisements
            </Link>
            <Link to="/createadvertisement" className="nav-link">
              New Advertisement
            </Link>
            <Link to="/subscription" className="nav-link">
              Subscriptions
            </Link>
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
            {this.props.session.userType == UserType.Admin && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
          </Nav>
          <Login
            name={this.state.name}
            onNameChange={this.handleNameChange}
            password={this.state.password}
            onPasswordChange={this.handlePasswordChange}
            onLoginClicked={this.handleLogin}
            session={this.props.session}
          />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session || undefined
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return { loginUser: (request: LoginRequest) => dispatch(loginUser(request)) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar);
