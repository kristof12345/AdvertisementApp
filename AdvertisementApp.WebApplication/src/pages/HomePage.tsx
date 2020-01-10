import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { connect } from "react-redux";
import { Advertisement } from "../models/advertisement/AdvertisementBasic";
import SearchField from "../components/User/SearchField";
import {
  searchAdvertisements,
  getFeaturedAdvertisements
} from "../redux/Advertisements/AdvertisementActions";
import UserManagement from "../components/Common/UserManagement/UserManagement";
import { RegisterRequest, LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { loginUser, registerUser } from "../redux/Users/UserActions";
import AdvertisementList from "../components/User/AdvertisementList";
import { SearchRequest } from "../models/advertisement/AdvertisementRequests";
import { Session } from "../models/user/Session";
import { loadSettings } from "../http/SettingsDataLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { AppSettings } from "../models/common/AppSettings";
import { Cursor } from "../models/common/Cursor";

const pageSize = 10;

interface IProps extends RouteComponentProps {
  getFeaturedAdvertisements: typeof getFeaturedAdvertisements;
  search: typeof searchAdvertisements;
  advertisements: Advertisement[];
  featuredAdvertisements: Advertisement[];
  searchParams: SearchRequest;
  loginUser: typeof loginUser;
  registerUser: typeof registerUser;
  session: Session;
}

interface IState {
  isDefaultSearch: boolean;
  settings: AppSettings;
  cursor: Cursor;
}

class HomePage extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    loadSettings().then((result: AppSettings) => {
      this.setState({ settings: result });
    });
    this.state = {
      settings: { title: "", subtitle: "" },
      isDefaultSearch: true,
      cursor: { from: 0, to: pageSize }
    };
  }

  public componentDidMount() {
    this.props.getFeaturedAdvertisements(0, pageSize);
    this.setState({
      cursor: {
        from: this.state.cursor.from + pageSize,
        to: this.state.cursor.to + pageSize
      }
    });
  }

  private handleSearch = (request: SearchRequest) => {
    this.props.search(request, 0, pageSize);
    this.setState({
      isDefaultSearch: false,
      cursor: {
        from: 0,
        to: pageSize
      }
    });
  };

  loadMore = async () => {
    const cursor = this.state.cursor;
    if (this.state.isDefaultSearch) {
      this.props.getFeaturedAdvertisements(cursor.from, cursor.to);
    } else {
      this.props.search(this.props.searchParams, cursor.from, cursor.to);
    }
    this.setState({
      cursor: {
        from: cursor.from + pageSize,
        to: cursor.to + pageSize
      }
    });
  };

  render() {
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src="hero1.jpg" alt="First slide" />
            <Carousel.Caption>
              <div>
                <h1>{this.state.settings.title}</h1>
                <h3>{this.state.settings.subtitle}</h3>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="hero2.jpg" alt="Third slide" />
            <Carousel.Caption>
              <div>
                <h1>{this.state.settings.title}</h1>
                <h3>{this.state.settings.subtitle}</h3>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="hero3.jpg" alt="Third slide" />
            <Carousel.Caption>
              <div>
                <h1>{this.state.settings.title}</h1>
                <h3>{this.state.settings.subtitle}</h3>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div>
          <UserManagement
            session={this.props.session}
            handleRegisterClick={this.props.registerUser}
            handleLoginClick={this.props.loginUser}
          />
        </div>
        <SearchField
          onSearchClicked={this.handleSearch}
          title="Search for your home"
        />
        <InfiniteScroll
          dataLength={this.state.cursor.to}
          next={this.loadMore}
          hasMore={true}
        >
          <AdvertisementList
            content={
              this.state.isDefaultSearch
                ? this.props.featuredAdvertisements
                : this.props.advertisements
            }
          />
        </InfiniteScroll>
      </div>
    );
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session,
    featuredAdvertisements: store.advertisements.featuredAdvertisements,
    advertisements: store.advertisements.advertisements,
    searchParams: store.advertisements.searchParams
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (request: LoginRequest) => dispatch(loginUser(request)),
    registerUser: (request: RegisterRequest) => dispatch(registerUser(request)),
    getFeaturedAdvertisements: (from: number, to: number) =>
      dispatch(getFeaturedAdvertisements(from, to)),
    search: (searchParams: SearchRequest, from: number, to: number) =>
      dispatch(searchAdvertisements(searchParams, from, to))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
