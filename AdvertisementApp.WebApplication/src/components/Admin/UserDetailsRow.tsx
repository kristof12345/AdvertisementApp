import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DetailedUser, { UserStatus } from "../../models/user/DetailedUser";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

interface IProps {
  user: DetailedUser;
  disableUser: (name: string) => void;
  enableUser: (name: string) => void;
}

class UserDetailsRow extends Component<IProps> {
  private handleDisable = () => {
    this.props.disableUser(this.props.user.userName);
  };

  private handleEnable = () => {
    this.props.enableUser(this.props.user.userName);
  };

  private renderStatus = (status: number) => {
    var ret = status == 0 ? "Enabled" : "disabled";
    return ret;
  };

  render() {
    const user = this.props.user;
    return (
      <Row
        style={{ paddingLeft: "12px", minHeight: "20px", marginBottom: "10px" }}
      >
        <Col md={3} sm={6}>
          {user.userName}
        </Col>
        <Col md={3} sm={6}>
          {user.email}
        </Col>
        <Col md={2} sm={6}>
          {user.subscriptionName}
        </Col>
        <Col md={2} sm={6}>
          {this.renderStatus(user.status)}
        </Col>
        <Col md={2} sm={12}>
          {user.status == UserStatus.Enabled ? (
            <button
              onClick={this.handleDisable}
              type="button"
              className="btn btn-outline-danger btn-sm btn-block"
            >
              Disable
            </button>
          ) : (
            <button
              onClick={this.handleEnable}
              type="button"
              className="btn btn-outline-primary btn-sm btn-block"
            >
              Enable
            </button>
          )}
        </Col>
      </Row>
    );
  }
}

export default UserDetailsRow;
