import React, { Component } from "react";
import { Advertisement } from "../../models/advertisement/AdvertisementBasic";
import { getMyAdvertisements } from "../../redux/Advertisements/AdvertisementActions";
import AdvertisementList from "../../components/Advertiser/AdvertisementList";
import { Session, UserStatus } from "../../models/user/Session";
import { withRouter } from "react-router-dom";

interface IProps {
  getMyAdvertisements: typeof getMyAdvertisements;
  myAdvertisements: Advertisement[];
  onDeleteClicked: (id: number) => void;
  session: Session;
}

class MyAdvertisementsList extends Component<IProps> {
  public componentDidMount() {
    if (this.props.session.status == UserStatus.LoggedIn) {
      this.props.getMyAdvertisements(this.props.session.username);
    }
  }

  private CreateButton = withRouter(({ history }) => (
    <button
      className="btn btn-outline-success col-3 m-1"
      type="button"
      onClick={() => {
        history.push("/createadvertisement");
      }}
    >
      Create advertisement
    </button>
  ));

  render() {
    if (this.props.myAdvertisements.length > 0) {
      return (
        <div className="page-container">
          <AdvertisementList
            content={this.props.myAdvertisements}
            onDeleteClicked={this.props.onDeleteClicked}
          />
        </div>
      );
    } else {
      return (
        <div>
          <div className="container text-center">
            <h1 className="display-4 text-center">
              Welcome {this.props.session.username} !
            </h1>
            <p className="lead text-center">
              You don't have any advertisements yet. To create a new
              advertisement click the button below!
            </p>
            <this.CreateButton />
          </div>
        </div>
      );
    }
  }
}

export default MyAdvertisementsList;
