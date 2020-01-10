import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getAdvertisement } from "../redux/Advertisements/AdvertisementActions";
import { IApplicationState } from "../redux/Store";
import { Advertisement } from "../models/advertisement/AdvertisementDetailed";
import AdvertisementDetails from "../components/User/AdvertisementDetails";
import AdvertisementAdminDetails from "../components/Admin/AdvertisementDetails";
import { Session, UserType } from "../models/user/Session";

interface IProps extends RouteComponentProps<{ id: string }> {
  getAdvertisement: typeof getAdvertisement;
  advertisement?: Advertisement;
  session: Session;
}

class AdvertisementDetailPage extends Component<IProps> {
  public componentDidMount() {
    if (this.props.match.params.id) {
      const id: number = parseInt(this.props.match.params.id, 10);
      this.props.getAdvertisement(id);
    }
  }
  
  public render() {
    if (this.props.advertisement == undefined) return null;
    else {
      if (this.props.session && this.props.session.userType == UserType.Admin)
        return (
          <div className="page-container">
            <AdvertisementAdminDetails
              advertisement={this.props.advertisement}
            />
          </div>
        );
      else
        return (
          <div className="page-container">
            <AdvertisementDetails advertisement={this.props.advertisement} />
          </div>
        );
    }
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getAdvertisement: (id: number) => dispatch(getAdvertisement(id))
  };
};

const mapStateToProps = (store: IApplicationState) => {
  return {
    advertisement: store.advertisements.currentAdvertisement || undefined,
    session: store.users.session
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertisementDetailPage);
