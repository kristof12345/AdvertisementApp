import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { LoginRequest } from "../models/user/UserRequests";
import { IApplicationState } from "../redux/Store";
import { Session } from "../models/user/Session";
import {
  getAdvertisement,
  updateAdvertisement
} from "../http/AdvertisementDataLoader";
import EditAdvertisement from "../components/Advertiser/EditAdvertisement";
import { loginUser, getUserDetails } from "../redux/Users/UserActions";
import { Advertisement } from "../models/advertisement/AdvertisementDetailed";
import {
  getCategories,
  getDetails
} from "../redux/Advertisements/AdvertisementActions";
import { UpdateRequest } from "../models/advertisement/AdvertisementRequests";
import { Subscription } from "../models/subscription/Subscription";
import { Category, Detail } from "../models/advertisement/Detail";

interface IProps extends RouteComponentProps<{ id: string }> {
  session: Session;
  getUserDetails: typeof getUserDetails;
  subscription: Subscription;
  getCategories: typeof getCategories;
  categories: Category[];
  getDetails: typeof getDetails;
  details: Detail[];
}

interface IState {
  advertisement: Advertisement | null;
}

class EditAdvertisementPage extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      advertisement: null
    };
  }

  public async componentDidMount() {
    if (this.props.match.params.id) {
      const id: number = parseInt(this.props.match.params.id, 10);
      var adv = await getAdvertisement(id);
      this.setState({
        advertisement: adv
      });
    }
  }

  private handleEditClick(request: UpdateRequest): Promise<Advertisement> {
    return updateAdvertisement(request);
  }

  public render() {
    if (this.state.advertisement == null) return null;
    return (
      <div className="page-container">
        <EditAdvertisement
          advertisement={this.state.advertisement}
          session={this.props.session}
          onSubmitClicked={request => this.handleEditClick(request)}
          categories={this.props.categories}
          getCategories={this.props.getCategories}
          metaDetails={this.props.details}
          getDetails={this.props.getDetails}
          getUserDetails={this.props.getUserDetails}
          subscription={this.props.subscription}
        />
      </div>
    );
  }
}

//A propok hozzákötése a globális állapothoz
const mapStateToProps = (store: IApplicationState) => {
  return {
    session: store.users.session || undefined,
    subscription: store.users.details,
    details: store.advertisements.details,
    categories: store.advertisements.categories
  };
};

//Függvények hozzákötése az actionökhöz
const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (request: LoginRequest) => dispatch(loginUser(request)),
    getUserDetails: (name: string) => dispatch(getUserDetails(name)),
    getDetails: () => dispatch(getDetails()),
    getCategories: () => dispatch(getCategories())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditAdvertisementPage);
