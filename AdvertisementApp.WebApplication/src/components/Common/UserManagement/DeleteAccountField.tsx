import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface IProps {
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClicked: () => void;
}

class DeleteAccountField extends Component<IProps> {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Delete account</p>
              </div>
              <Form validated={true}>
                <h5>Delete account</h5>
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <input
                        value={this.props.password}
                        onChange={this.props.onPasswordChange}
                        type="password"
                        className="form-control mr-sm-2 m-0"
                        placeholder="Enter password"
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Button
                  variant="outline-danger"
                  onClick={this.props.onDeleteClicked}
                >
                  Delete
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DeleteAccountField;
