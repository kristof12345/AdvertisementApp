import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Advertisement } from "../models/advertisement/AdvertisementBasic";
import AdvertisementList from "../components/User/AdvertisementList";
import SearchField from "../components/User/SearchField";
import { IApplicationState } from "../redux/Store";
import {
  getAdvertisements,
  searchAdvertisements
} from "../redux/Advertisements/AdvertisementActions";
import { Session } from "../models/user/Session";
import { SearchRequest } from "../models/advertisement/AdvertisementRequests";
import InfiniteScroll from "react-infinite-scroll-component";
import { Cursor } from "../models/common/Cursor";

const pageSize = 10;

interface IProps extends RouteComponentProps {
  getAdvertisements: typeof getAdvertisements;
  search: typeof searchAdvertisements;
  advertisements: Advertisement[];
  searchParams: SearchRequest;
  session: Session;
}

interface IState {
  isDefaultSearch: boolean;
  cursor: Cursor;
}

class AdvertisementsPage extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      isDefaultSearch: true,
      cursor: { from: 0, to: pageSize }
    };
  }

  public componentDidMount() {
    this.props.getAdvertisements(0, pageSize);
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
      this.props.getAdvertisements(cursor.from, cursor.to);
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
        <SearchField
          onSearchClicked={(r: SearchRequest) => this.handleSearch(r)}
          title="Search for your home"
        />
        <div>
          <InfiniteScroll
            dataLength={this.state.cursor.to}
            next={this.loadMore}
            hasMore={true}
          >
            <AdvertisementList content={this.props.advertisements} />
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    advertisements: store.advertisements.advertisements,
    searchParams: store.advertisements.searchParams,
    session: store.users.session
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    getAdvertisements: (from: number, to: number) =>
      dispatch(getAdvertisements(from, to)),
    search: (searchParams: SearchRequest, from: number, to: number) =>
      dispatch(searchAdvertisements(searchParams, from, to))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertisementsPage);
