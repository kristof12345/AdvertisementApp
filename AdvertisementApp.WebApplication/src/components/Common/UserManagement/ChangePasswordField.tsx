import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface IProps {
  oldPass: string;
  onOldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newPass: string;
  onNewChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyClicked: () => void;
}

class ChangePasswordField extends Component<IProps> {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Password settings</p>
              </div>
              <Form validated={true}>
                <h5>Change password</h5>
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Current password</Form.Label>
                      <input
                        value={this.props.oldPass}
                        onChange={this.props.onOldChange}
                        type="password"
                        className="form-control mr-sm-2 m-0"
                        placeholder="Enter current password"
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>New password</Form.Label>
                      <input
                        value={this.props.newPass}
                        onChange={this.props.onNewChange}
                        className="form-control mr-sm-2 m-0"
                        type="password"
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Button
                  variant="outline-success"
                  onClick={this.props.onApplyClicked}
                >
                  Apply
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ChangePasswordField;
