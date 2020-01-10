import React, { Component } from "react";
import {Advertisement} from "../../models/advertisement/AdvertisementBasic";
import AdvertisementCard from "./AdvertisementCard";
import InfoText from "../Common/InfoText";

interface IProps {
  content: Advertisement[];
}

class AdvertisementList extends Component<IProps> {
  render() {
    if (this.props.content.length==0) return <InfoText text="No advertisements appropriate for the search!"></InfoText>;
    return (
      <div className="row m-0">
        {this.props.content.map(adv => (
          <AdvertisementCard key={adv.id} advertisement={adv}
          />
        ))}
      </div>
    );
  }
}

export default AdvertisementList;
