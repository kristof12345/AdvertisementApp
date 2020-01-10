import User from "../user/User";
import { Status, Priority } from "./AdvertisementEnums";
import { Detail } from "./Detail";

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  imageList: string[];
  details: Detail[];
  userName: string;
  user: User;
  status: Status;
  priority: Priority;
  categoryId: number;
  categoryName: string;
}
