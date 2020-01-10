import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { ErrorModel } from "../../../models/common/ErrorModel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { ReactInputEvent } from "../../../models/common/ReactInputEvent";

interface IProps {
  name: string;
  onNameChange: (event: ReactInputEvent) => void;
  email: string;
  onEmailChange: (event: ReactInputEvent) => void;
  password: string;
  onPasswordChange: (event: ReactInputEvent) => void;
  phone: string;
  onPhoneChange: (event: ReactInputEvent) => void;
  onValidationError: (fieldName: string) => void;
  onRegisterClicked: () => void;
  error?: ErrorModel;
}

class RegisterField extends Component<IProps> {
  private handleRegisterClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRegisterClicked();
    return false;
  };

  private renderError() {
    var error = this.props.error;
    if (error != null && error.type == "Register")
      return (
        <div className="alert alert-danger" role="alert">
          <strong>{error.code + " "}</strong>
          {error.description}
        </div>
      );
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Register for free!</p>
              </div>
              <Form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                  this.handleRegisterClick(e)
                }
                validated
              >
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        value={this.props.name}
                        onChange={this.props.onNameChange}
                        type="text"
                        className="mr-sm-2 m-0"
                        placeholder="Enter username"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        value={this.props.email}
                        onChange={this.props.onEmailChange}
                        type="email"
                        className="mr-sm-2 m-0"
                        placeholder="Enter email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        value={this.props.password}
                        onChange={this.props.onPasswordChange}
                        className="mr-sm-2 m-0"
                        type="password"
                        placeholder="Password"
                        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                        onInvalid={() =>
                          this.props.onValidationError("Password")
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control
                        value={this.props.phone}
                        onChange={this.props.onPhoneChange}
                        className="mr-sm-2 m-0"
                        type="tel"
                        pattern="^\+?\d{0,13}"
                        placeholder="Phone number"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>{this.renderError()}</Form.Row>
                <Button variant="outline-success" type="submit">
                  Register
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RegisterField;
