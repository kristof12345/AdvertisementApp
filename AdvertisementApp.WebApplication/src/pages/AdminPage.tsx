import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { loginUser, loadUserList } from "../redux/Users/UserActions";
import { UserStatus, UserType } from "../models/user/Session";
import UsersList from "../components/Admin/UsersList";
import DetailedUser from "../models/user/DetailedUser";
import AdvertisementList from "../components/User/AdvertisementList";
import SearchField from "../components/User/SearchField";
import { Session } from "../models/user/Session";
import { SearchRequest } from "../models/advertisement/AdvertisementRequests";
import InfiniteScroll from "react-infinite-scroll-component";
import { Advertisement } from "../models/advertisement/AdvertisementBasic";
import { searchDisabledAdvertisements } from "../redux/Advertisements/AdvertisementActions";
import Login from "../components/Common/UserManagement/Login";
import { Cursor } from "../models/common/Cursor";

const pageSize = 10;

interface IProps extends RouteComponentProps {
  loginUser: typeof loginUser;
  session: Session;
  userList?: DetailedUser[];
  loadUserList: typeof loadUserList;
  search: typeof searchDisabledAdvertisements;
  disabledAdvertisements: Advertisement[];
  searchParams: SearchRequest;
}

interface IState {
  cursor: Cursor;
}

class AdminPage extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      cursor: { from: 0, to: 0 }
    };
  }

  private handleLogin = (request: LoginRequest) => {
    this.props.loginUser(request);
  };

  private handleSearch = (request: SearchRequest) => {
    this.props.search(request, 0, pageSize);
    this.setState({
      cursor: {
        from: pageSize,
        to: 2 * pageSize
      }
    });
  };

  loadMore = async () => {
    const cursor = this.state.cursor;
    this.props.search(this.props.searchParams, cursor.from, cursor.to);
    this.setState({
      cursor: {
        from: cursor.from + pageSize,
        to: cursor.to + pageSize
      }
    });
  };

  render() {
    if (
      this.props.session.status != UserStatus.LoggedIn ||
      this.props.session.userType != UserType.Admin
    ) {
      return (
        <div className="page-container">
          <h1>Administrator Panel</h1>
          <p>You should only be here if you have logged in as administrator</p>
          <Login
            onLoginClicked={this.handleLogin}
            error={this.props.session && this.props.session.error}
          />
        </div>
      );
    } else {
      return (
        <div className="page-container">
          <UsersList
            users={this.props.userList}
            loadUserList={this.props.loadUserList}
          />
          <div>
            <SearchField
              onSearchClicked={(r: SearchRequest) => this.handleSearch(r)}
              title="Disabled ads"
            />
            <div>
              {this.state.cursor.to > 0 && (
                <InfiniteScroll
                  dataLength={this.state.cursor.to}
                  next={this.loadMore}
                  hasMore={true}
                >
                  <AdvertisementList
                    content={this.props.disabledAdvertisements}
                  />
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session || undefined,
    userList: store.users.userList,
    disabledAdvertisements: store.advertisements.disabledAdvertisements,
    searchParams: store.advertisements.searchParams
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loadUserList: (name: string) => dispatch(loadUserList(name)),
    loginUser: (request: LoginRequest) => dispatch(loginUser(request)),
    search: (searchParams: SearchRequest, from: number, to: number) =>
      dispatch(searchDisabledAdvertisements(searchParams, from, to))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPage);
