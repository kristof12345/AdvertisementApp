import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { Redirect } from "react-router";
import { Session } from "../../models/user/Session";
import { CreateRequest } from "../../models/advertisement/AdvertisementRequests";
import { getUserDetails } from "../../redux/Users/UserActions";
import {
  getCategories,
  getDetails
} from "../../redux/Advertisements/AdvertisementActions";
import { submitImages, generateOptions } from "../../http/ImageDataLoader";
import ImagePicker from "react-image-picker";
import {
  Subscription,
  remaining
} from "../../models/subscription/Subscription";
import { Category, Detail } from "../../models/advertisement/Detail";
import { Advertisement } from "../../models/advertisement/AdvertisementDetailed";
import { Priority } from "../../models/advertisement/AdvertisementEnums";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface IProps {
  session: Session;
  categories: Category[];
  getCategories: typeof getCategories;
  metaDetails: Detail[];
  getDetails: typeof getDetails;
  onSubmitClicked: (request: CreateRequest) => Promise<Advertisement>;
  getUserDetails: typeof getUserDetails;
  subscription: Subscription;
}

interface IState {
  advertisement: CreateRequest;
  fileList: FileList | null;
  selectedImage: number;
  error: boolean;
  redirect?: number;
}

class CreateAdvertisement extends Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      advertisement: {
        details: props.metaDetails,
        title: "",
        description: "",
        price: 0,
        priority: Priority.Normal
      },
      fileList: null,
      selectedImage: 0,
      error: false,
      redirect: undefined
    };
  }

  public componentDidMount() {
    this.props.getDetails();
    this.props.getCategories();
    this.props.getUserDetails(this.props.session.username);
  }

  public componentWillReceiveProps() {
    var advertisement = { ...this.state.advertisement };
    advertisement.details = this.props.metaDetails;
    this.setState({ advertisement });
  }

  private handleSubmitClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    //Hiba, ha nincs kép
    if (this.state.fileList == null || this.state.fileList.length > 10) {
      this.setState({ error: true });
      return false;
    }

    //Hirdetés adatainak elküldése
    var request = this.state.advertisement;

    //Új képek feltöltése
    var array = [];
    for (var i = 0; i < this.state.fileList.length; i++) {
      array.push(this.state.fileList[i]);
    }
    var imgArray = await submitImages(array);
    request.image = imgArray[this.state.selectedImage];
    request.imageList = imgArray;

    var result = await this.props.onSubmitClicked(request);
    this.setState({ redirect: result.id });
    return false;
  };

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.title = e.currentTarget.value;
    this.setState({ advertisement });
  };

  handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.price = +e.currentTarget.value;
    this.setState({ advertisement });
  };

  handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.priority = +e.currentTarget.id;
    this.setState({ advertisement });
  };

  handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.categoryId =
      this.props.categories.findIndex(c => c.name == e.target.value) + 1;
    this.setState({ advertisement });
  };

  handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.description = e.currentTarget.value;
    this.setState({ advertisement });
  };

  private handleImagePick = (image: any) => {
    this.setState({ selectedImage: image.value });
  };

  private handleFileChange = async (fileList: FileList | null) => {
    if (fileList != null) {
      this.setState({ fileList, selectedImage: 0 });
    }
  };

  private renderCustomFields = () => {
    let fields = [];
    var details = this.state.advertisement.details;
    for (let i = 0; i <= details.length - 1; i++) {
      switch (details[i].type) {
        case 0:
        case 1:
          fields.push(
            <Col sm="12" md="6" key={i}>
              <Form.Group>
                <Form.Label>{details[i].name}</Form.Label>
                <input
                  type={details[i].type == 0 ? "text" : "number"}
                  className="form-control mr-sm-2 m-0"
                  onChange={e => this.handleChange(e, i)}
                  required={details[i].required}
                />
              </Form.Group>
            </Col>
          );
          break;
        case 2:
          fields.push(
            <Col sm md="6" key={i}>
              <Form.Group>
                <Form.Label>{details[i].name}</Form.Label>
                <select
                  required={details[i].required}
                  className="custom-select mr-sm-2 m-0"
                  onChange={e => this.handleChange(e, i)}
                >
                  <option value="">Select {details[i].name}</option>
                  {generateOptions(details[i].possibleValues)}
                </select>
              </Form.Group>
            </Col>
          );
          break;
      }
    }
    return fields;
  };

  private handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: number
  ) {
    var advertisement = { ...this.state.advertisement };
    if (+e.target.value) {
      advertisement.details[id].numberValue = +e.target.value;
    } else {
      advertisement.details[id].stringValue = e.target.value;
    }
    this.setState({ advertisement });
  }

  private renderError() {
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <strong>{"Please upload minimum 1, maximum 10 images! "}</strong>
          Invalid images.
        </div>
      );
    }
  }

  private renderImages() {
    if (this.state.fileList == null) {
      return null;
    } else {
      var array = [];
      for (var i = 0; i < this.state.fileList.length; i++) {
        array.push(this.state.fileList[i]);
      }
      return (
        <ImagePicker
          images={array.map((image, i) => ({
            src: URL.createObjectURL(image),
            value: i
          }))}
          onPick={this.handleImagePick}
        />
      );
    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Create advertisement</p>
              </div>
              <Form
                validated={true}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                  this.handleSubmitClick(e)
                }
              >
                <Form.Row>
                  <Col sm="12">
                    <Form.Group>
                      <Form.Label>Advertisement title</Form.Label>
                      <input
                        value={this.state.advertisement.title}
                        onChange={e => this.handleTitleChange(e)}
                        type="text"
                        className="form-control mr-sm-2 m-0"
                        placeholder="Enter advertisement title"
                        minLength={5}
                        maxLength={20}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <input
                        pattern="[0-9]*"
                        value={this.state.advertisement.price}
                        onChange={e => this.handlePriceChange(e)}
                        type="number"
                        className="form-control mr-sm-2 m-0"
                        placeholder="Enter advertisement price"
                        min={0}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col sm md="6">
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <select
                        required
                        className="custom-select mr-sm-2 m-0"
                        onChange={this.handleCategoryChange}
                      >
                        <option value="">Select category</option>
                        {generateOptions(
                          this.props.categories.map(c => c.name)
                        )}
                      </select>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>{this.renderCustomFields()}</Form.Row>
                <Form.Row>
                  <Col sm="12">
                    <Form.Group>
                      <Form.Label>Advertisement description</Form.Label>
                      <textarea
                        rows={4}
                        value={this.state.advertisement.description}
                        onChange={e => this.handleDescriptionChange(e)}
                        className="form-control mr-sm-2 m-0"
                        placeholder="Enter advertisement description"
                        maxLength={500}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                {["Normal", "Highlighted", "Featured"].map((name, index) => (
                  <div key={`default-${name}`} className="mb-3">
                    <Form.Check
                      type="radio"
                      name="priority"
                      label={
                        name +
                        " ( Available: " +
                        remaining(this.props.subscription, name) +
                        " )"
                      }
                      id={index.toString()}
                      onChange={this.handlePriorityChange}
                      defaultChecked={name == "Normal"}
                    />
                  </div>
                ))}
                <Form.Row>{this.renderImages()}</Form.Row>
                <div>
                  <label className="mt-2 btn btn-primary">
                    Upload images
                    <input
                      hidden={true}
                      name="file"
                      type="file"
                      multiple={true}
                      onChange={e => this.handleFileChange(e.target.files)}
                    />
                  </label>
                </div>
                {this.renderError()}
                <Button variant="outline-success" type="submit">
                  Create advertisement
                </Button>
                {this.state.redirect && (
                  <Redirect to={"/myadvertisements/" + this.state.redirect} />
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CreateAdvertisement;
