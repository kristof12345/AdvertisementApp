import { Detail } from "./Detail";
import { Priority } from "./AdvertisementEnums";

export interface CreateRequest {
  title: string;
  description: string;
  price: number;
  image?: string;
  imageList?: string[];
  details: Detail[];
  priority: Priority;
  categoryId?: number;
}

export interface UpdateRequest {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  imageList: string[];
  details: Detail[];
  priority?: Priority;
  categoryId: number;
  imagesChanged: boolean;
}

export interface SearchRequest {
  title?: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  categoriId?: number;
  minDate?: string;
  maxDate?: string;
  details?: Detail[];
  orderBy?: number;
  order?: number;
}
