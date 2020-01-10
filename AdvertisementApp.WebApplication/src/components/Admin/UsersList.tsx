import React, { Component } from "react";
import DetailedUser from "../../models/user/DetailedUser";
import UserDetailsRow from "./UserDetailsRow";
import Button from "react-bootstrap/Button";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import { loadUserList } from "../../redux/Users/UserActions";
import { disableUser, enableUser } from "../../http/UserDataLoader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface IProps {
  users?: DetailedUser[];
  loadUserList: typeof loadUserList;
}

interface IState {
  search: string;
}

class UsersList extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      search: ""
    };
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: e.target.value });
  };

  private handleSearch = () => {
    this.props.loadUserList(this.state.search);
  };

  private handleDisable = async (name: string) => {
    await disableUser(name);
    this.props.loadUserList(this.state.search);
  };

  private handleEnable = async (name: string) => {
    await enableUser(name);
    this.props.loadUserList(this.state.search);
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Registered users</p>
              </div>
              <InputGroup className="mb-3">
                <input
                  className="form-control"
                  value={this.state.search}
                  onChange={this.handleChange}
                  placeholder="Search by username"
                />
                <InputGroup.Append>
                  <Button onClick={this.handleSearch} variant="outline-primary">
                    Search
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              {this.props.users &&
                this.props.users.map(user => (
                  <UserDetailsRow
                    key={user.userName}
                    user={user}
                    enableUser={this.handleEnable}
                    disableUser={this.handleDisable}
                  ></UserDetailsRow>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default UsersList;
