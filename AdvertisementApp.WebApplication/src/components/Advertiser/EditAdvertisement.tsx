import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { Session } from "../../models/user/Session";
import { Redirect } from "react-router";
import { getUserDetails } from "../../redux/Users/UserActions";
import {
  generateOptions,
  submitImages,
  deleteImages
} from "../../http/ImageDataLoader";
import { Advertisement } from "../../models/advertisement/AdvertisementDetailed";
import {
  getCategories,
  getDetails
} from "../../redux/Advertisements/AdvertisementActions";
import ImagePicker from "react-image-picker";
import "react-image-picker/dist/index.css";
import { UpdateRequest } from "../../models/advertisement/AdvertisementRequests";
import {
  Subscription,
  remaining
} from "../../models/subscription/Subscription";
import { baseUrl } from "../../http/SettingsDataLoader";
import { Category, Detail } from "../../models/advertisement/Detail";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface IProps {
  session: Session;
  advertisement: Advertisement;
  categories: Category[];
  getCategories: typeof getCategories;
  metaDetails: Detail[];
  getDetails: typeof getDetails;
  onSubmitClicked: (request: UpdateRequest) => Promise<Advertisement>;
  getUserDetails: typeof getUserDetails;
  subscription: Subscription;
}

interface IState {
  advertisement: UpdateRequest;
  fileList: FileList | null;
  imagesChanged: boolean;
  selectedImage: number;
  error: boolean;
  redirect: number | undefined;
}

class EditAdvertisement extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      advertisement: { ...props.advertisement, imagesChanged: false },
      fileList: null,
      imagesChanged: false,
      selectedImage: 0,
      error: false,
      redirect: undefined
    };
  }

  public componentDidMount() {
    this.props.getDetails();
    this.props.getCategories();
    console.log(this.props.session.username);
    this.props.getUserDetails(this.props.session.username);
  }

  private handleSubmitClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    //Hiba, ha nincs kép
    if (
      this.state.imagesChanged &&
      (this.state.fileList == null || this.state.fileList.length > 10)
    ) {
      this.setState({ error: true });
      return false;
    }

    //Módosítások elküldése
    var request: UpdateRequest = this.state.advertisement;

    request.image = this.state.advertisement.imageList[
      this.state.selectedImage
    ];
    if (this.state.imagesChanged && this.state.fileList != null) {
      //Korábbi képek törlése
      await deleteImages(
        this.state.advertisement.imageList,
        this.props.session.username
      );
      //Új képek feltöltése
      var array = [];
      for (var i = 0; i < this.state.fileList.length; i++) {
        array.push(this.state.fileList[i]);
      }
      var imgArray = await submitImages(array);
      request.image = imgArray[this.state.selectedImage];
      request.imageList = imgArray;
    }
    var res = await this.props.onSubmitClicked(request);
    this.setState({ redirect: res.id });
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

  handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.categoryId =
      this.props.categories.findIndex(c => c.name == e.target.value) + 1;
    this.setState({ advertisement });
  };

  handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var advertisement = { ...this.state.advertisement };
    advertisement.priority = +e.currentTarget.id;
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
      this.setState({ fileList, imagesChanged: true, selectedImage: 0 });
    }
  };

  private renderCustomFields = () => {
    let fields = [];
    var details = this.state.advertisement.details;
    for (let i = 0; i <= details.length - 1; i++) {
      switch (details[i].type) {
        case 0:
          fields.push(
            <Col sm md="6" key={i}>
              <Form.Group>
                <Form.Label>{details[i].name}</Form.Label>
                <input
                  type="text"
                  className="form-control mr-sm-2 m-0"
                  onChange={e => this.handleChange(e, i)}
                  value={details[i].stringValue}
                />
              </Form.Group>
            </Col>
          );
          break;
        case 1:
          fields.push(
            <Col sm md="6" key={i}>
              <Form.Group>
                <Form.Label>{details[i].name}</Form.Label>
                <input
                  type="number"
                  className="form-control mr-sm-2 m-0"
                  onChange={e => this.handleChange(e, i)}
                  value={
                    details[i].stringValue.length
                      ? details[i].stringValue
                      : details[i].numberValue
                  }
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
                  required
                  className="custom-select mr-sm-2 m-0"
                  id="inlineFormCustomSelectPref"
                  onChange={e => this.handleChange(e, i)}
                  defaultValue={details[i].stringValue}
                >
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
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) {
    var advertisement = { ...this.state.advertisement };
    advertisement.details[id].stringValue = e.target.value;
    this.setState({ advertisement });
  }

  private renderError() {
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <strong>{"Missing image "}</strong>
          To modify an advertisement, select an image.
        </div>
      );
    }
  }

  private renderImages = () => {
    var images: any;
    if (this.state.fileList != null) {
      var array = [];
      for (var i = 0; i < this.state.fileList.length; i++) {
        array.push(this.state.fileList[i]);
      }
      images = array.map((image: any, i: number) => ({
        src: URL.createObjectURL(image),
        value: i
      }));
    } else {
      images = this.state.advertisement.imageList.map((image, i) => ({
        src: baseUrl + "image/" + this.props.session.username + "/" + image,
        value: i
      }));
    }
    return <ImagePicker images={images} onPick={this.handleImagePick} />;
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <div className="labeled-form">
              <div className="form-title">
                <p>Edit advertisement</p>
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
                        defaultValue={this.props.advertisement.categoryName}
                        required
                        className="custom-select mr-sm-2 m-0"
                        onChange={this.handleCategoryChange}
                      >
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
                      defaultChecked={
                        index == this.state.advertisement.priority
                      }
                    />
                  </div>
                ))}
                <Form.Row>
                  <Col sm md="6">
                    <Form.Group>
                      <div>
                        {this.renderImages()}
                        <label className="mt-3 btn btn-primary">
                          Upload images
                          <input
                            hidden={true}
                            name="file"
                            type="file"
                            multiple={true}
                            onChange={e =>
                              this.handleFileChange(e.target.files)
                            }
                          />
                        </label>
                      </div>
                    </Form.Group>
                  </Col>
                </Form.Row>
                {this.renderError()}
                <Button variant="outline-success" type="submit">
                  Update advertisement
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

export default EditAdvertisement;
