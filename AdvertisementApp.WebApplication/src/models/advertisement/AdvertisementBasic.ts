import { Status } from "./AdvertisementEnums";

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  userName: string;
  status: Status;
}
