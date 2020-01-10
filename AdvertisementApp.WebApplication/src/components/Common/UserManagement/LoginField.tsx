import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { ErrorModel } from "../../../models/common/ErrorModel";
import { ReactInputEvent } from "../../../models/common/ReactInputEvent";

interface IProps {
  name: string;
  password: string;
  onNameChange: (event: ReactInputEvent) => void;
  onPasswordChange: (event: ReactInputEvent) => void;
  onLoginClicked: () => void;
  error?: ErrorModel;
}

class LoginField extends Component<IProps> {
  private renderError() {
    var error = this.props.error;
    if (error && error.type == "Login")
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
                <p>Login</p>
              </div>
              <Form validated={true}>
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={this.props.name}
                        onChange={this.props.onNameChange}
                        className="mr-sm-2 m-0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        value={this.props.password}
                        onChange={this.props.onPasswordChange}
                        className="mr-sm-2 m-0"
                        type="password"
                        placeholder="Enter password"
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>{this.renderError()}</Form.Row>
                <Button
                  variant="outline-success"
                  onClick={this.props.onLoginClicked}
                >
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginField;
