import React, { Component } from "react";
import{ Advertisement }from "../../models/advertisement/AdvertisementBasic";
import AdvertisementCardEdit from "./AdvertisementCard";
import InfoText from "../Common/InfoText";

interface IProps {
  content: Advertisement[];
  onDeleteClicked: (id: number) => void;
}

class AdvertisementList extends Component<IProps> {
  render() {
    if (this.props.content.length==0) return <InfoText text="No advertisements appropriate for the search!"></InfoText>;
    return (
      <div className="row m-0">
        {this.props.content.map(adv => (
          <AdvertisementCardEdit key={adv.id} advertisement={adv} onDeleteClicked={ (id:number) => this.props.onDeleteClicked(id)}
          />
        ))}
      </div>
    );
  }
}

export default AdvertisementList;
