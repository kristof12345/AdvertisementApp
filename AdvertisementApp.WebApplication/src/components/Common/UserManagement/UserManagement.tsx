import React, { Component } from "react";
import LoginField from "./LoginField";
import RegisterField from "./RegisterField";
import WelcomeField from "./WelcomeField";
import { Session, UserStatus } from "../../../models/user/Session";
import { ReactInputEvent } from "../../../models/common/ReactInputEvent";
import {
  RegisterRequest,
  LoginRequest
} from "../../../models/user/UserRequests";
import { ErrorModel } from "../../../models/common/ErrorModel";

interface IProps {
  session: Session;
  handleRegisterClick: (request: RegisterRequest) => void;
  handleLoginClick: (request: LoginRequest) => void;
}

interface IState {
  name: string;
  email: string;
  password: string;
  phone: string;
  error?: ErrorModel;
}

class UserManagement extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      phone: ""
    };
  }

  private handleRegister = () => {
    this.props.handleRegisterClick({
      userName: this.state.name,
      password: this.state.password,
      phone: this.state.phone,
      email: this.state.email
    });
  };

  private handleValidation = (fieldName: string) => {
    if (fieldName == "Password") {
      this.setState({
        error: {
          type: "Register",
          code: "Invalid password",
          description:
            "Password must contain a capital letter a lower case letter and a number."
        }
      });
    }
  };

  private handlePasswordChange = (e: ReactInputEvent) => {
    var password = e.currentTarget.value!;
    this.setState({ password });
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test(password)) {
      this.setState({ error: undefined });
    }
  };

  render() {
    var error = this.state.error ? this.state.error : this.props.session.error;
    if (this.props.session.status == UserStatus.New) {
      return (
        <RegisterField
          name={this.state.name}
          onNameChange={(e: ReactInputEvent) =>
            this.setState({ name: e.currentTarget.value! })
          }
          email={this.state.email}
          onEmailChange={(e: ReactInputEvent) =>
            this.setState({ email: e.currentTarget.value! })
          }
          password={this.state.password}
          onPasswordChange={this.handlePasswordChange}
          phone={this.state.phone}
          onPhoneChange={(e: ReactInputEvent) =>
            this.setState({ phone: e.currentTarget.value! })
          }
          onRegisterClicked={this.handleRegister}
          onValidationError={this.handleValidation}
          error={error}
        />
      );
    } else if (this.props.session.status == UserStatus.Registered) {
      return (
        <LoginField
          name={this.state.name}
          onNameChange={(e: ReactInputEvent) =>
            this.setState({ name: e.currentTarget.value! })
          }
          password={this.state.password}
          onPasswordChange={(e: ReactInputEvent) =>
            this.setState({ password: e.currentTarget.value! })
          }
          onLoginClicked={() =>
            this.props.handleLoginClick({
              userName: this.state.name!,
              password: this.state.password!
            })
          }
          error={error}
        />
      );
    } else {
      return <WelcomeField username={this.props.session.username} />;
    }
  }
}

export default UserManagement;
