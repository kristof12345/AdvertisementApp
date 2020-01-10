import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { SearchRequest } from "../../models/advertisement/AdvertisementRequests";
import { getCustomDetails } from "../../http/AdvertisementDataLoader";
import { Detail } from "../../models/advertisement/Detail";
import Collapsible from "react-collapsible";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import CustomFields from "./CustomFields";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface IProps {
  onSearchClicked: (r: SearchRequest) => void;
  title: string;
}

interface IState {
  title: string;
  searchDetails: Detail[];
  minPrice: string;
  maxPrice: string;
  minDate?: Date;
  maxDate?: Date;
  order: number;
  orderBy: number;
}

class SearchField extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      searchDetails: [],
      title: "",
      minPrice: "",
      maxPrice: "",
      order: 0,
      orderBy: 0
    };
  }

  public componentDidMount() {
    getCustomDetails().then((result: Detail[]) => {
      this.setState({
        searchDetails: result
      });
    });
  }

  //Search
  private handleClick = () => {
    //Keresési paraméterek beállítása
    var request: SearchRequest = { title: this.state.title };
    if (this.state.minPrice) request.minPrice = +this.state.minPrice;
    if (this.state.maxPrice) request.maxPrice = +this.state.maxPrice;
    if (this.state.minDate) request.minDate = this.state.minDate.toISOString();
    if (this.state.maxDate) request.maxDate = this.state.maxDate.toISOString();
    if (this.state.orderBy) request.orderBy = this.state.orderBy;
    if (this.state.order) request.order = this.state.order;
    request.details = this.state.searchDetails;
    this.props.onSearchClicked(request);
  };

  //Change details
  private handleChange = (e: React.ChangeEvent<any>, id: number) => {
    var searchDetails = this.state.searchDetails;
    //Ha a "bármi" opció van kiválasztva
    if (e.target.selectedIndex == 0) {
      searchDetails[id].stringValue = "";
      //Ha szám érték
    } else if (+e.target.value) {
      searchDetails[id].numberValue = +e.target.value;
      searchDetails[id].stringValue = "";
      //Ha szöveges érték, és nem bármi
    } else {
      searchDetails[id].stringValue = e.target.value;
      searchDetails[id].numberValue = 0;
    }
    this.setState({ searchDetails });
  };

  //Sort
  handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ orderBy: e.target.selectedIndex });
  };

  handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ order: e.target.selectedIndex });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>{this.props.title}</p>
              </div>
              <Form>
                <Form.Row className="col center px-2 search-row">
                  <input
                    value={this.state.title}
                    onChange={e => {
                      this.setState({ title: e.target.value });
                    }}
                    type="text"
                    className="form-control col-md-3"
                    placeholder="Enter search text"
                  />
                  <input
                    value={this.state.minPrice}
                    onChange={e => {
                      this.setState({ minPrice: e.currentTarget.value });
                    }}
                    type="number"
                    className="form-control col-sm-6 col-md-2"
                    placeholder="Min price"
                    min={0}
                  />
                  <input
                    value={this.state.maxPrice}
                    onChange={e => {
                      this.setState({ maxPrice: e.currentTarget.value });
                    }}
                    type="number"
                    className="form-control col-sm-6 col-md-2"
                    placeholder="Max price"
                    min={this.state.minPrice}
                  />
                  <CustomFields
                    searchDetails={this.state.searchDetails.filter(
                      d => d.importance === 1
                    )}
                    handleChange={this.handleChange}
                  />
                  <Button
                    style={{ height: "38px" }}
                    variant="outline-success"
                    onClick={this.handleClick}
                  >
                    Search
                  </Button>
                </Form.Row>
                <div>
                  <Collapsible trigger="Detailed search">
                    <Form.Row className="col-centered pt-3">
                      <DatePicker
                        placeholderText="Min upload date"
                        className="form-control ml-2"
                        selected={this.state.minDate}
                        onChange={(date: Date) => {
                          this.setState({ minDate: date });
                        }}
                      />
                      <DatePicker
                        placeholderText="Max upload date"
                        className="form-control ml-2"
                        selected={this.state.maxDate}
                        onChange={(date: Date) => {
                          this.setState({ maxDate: date });
                        }}
                      />
                      <CustomFields
                        searchDetails={this.state.searchDetails.filter(
                          d => d.importance == 0
                        )}
                        handleChange={this.handleChange}
                        margin
                      />
                    </Form.Row>
                  </Collapsible>
                  <Form.Row className="col center">
                    <select
                      className="custom-select col-md-4 col-lg-3 m-2"
                      onChange={this.handleSortByChange}
                      placeholder="Sort by"
                    >
                      <option key={0}>{"Title"}</option>
                      <option key={1}>{"Price"}</option>
                      <option key={2}>{"Upload date"}</option>
                    </select>
                    <select
                      className="custom-select col-md-4 col-lg-3 m-2"
                      onChange={this.handleSortOrderChange}
                      placeholder="Order"
                    >
                      <option key={0}>{"Ascending"}</option>
                      <option key={1}>{"Descending"}</option>
                    </select>
                  </Form.Row>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SearchField;
