import React, { Component } from "react";
import { generateOptions } from "../Common/SelectOptions";
import { Detail } from "../../models/advertisement/Detail";

interface IProps {
  searchDetails: Detail[];
  handleChange: (e: React.ChangeEvent<HTMLElement>, id: number) => void;
  margin?: boolean;
}

class CustomFields extends Component<IProps> {
  render() {
    const style = this.props.margin
      ? "form-control col-xl-2 col-lg-3 col-md-5 mx-2"
      : "form-control col-xl-2 col-lg-3 col-md-5";
    let items = [];
    var fields = this.props.searchDetails;
    for (let i = 0; i <= fields.length - 1; i++) {
      switch (fields[i].type) {
        case 0:
          items.push(
            <input
              key={i}
              type="text"
              className={style}
              onChange={e => this.props.handleChange(e, i)}
              placeholder={fields[i].name}
            />
          );
          break;
        case 1:
          items.push(
            <input
              key={i}
              type="number"
              className={style}
              onChange={e => this.props.handleChange(e, i)}
              placeholder={fields[i].name}
            />
          );
          break;
        case 2:
          items.push(
            <select
              key={i}
              className={style}
              onChange={e => this.props.handleChange(e, i)}
              placeholder={fields[i].name}
            >
              <option key={0}>{"Any"}</option>
              {generateOptions(fields[i].possibleValues)}
            </select>
          );
          break;
      }
    }
    return items;
  }
}

export default CustomFields;
