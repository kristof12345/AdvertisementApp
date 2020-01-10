import axios from "axios";
import { Advertisement } from "../models/advertisement/AdvertisementBasic";
import { Advertisement as AdvertisementDetailed } from "../models/advertisement/AdvertisementDetailed";
import {
  CreateRequest,
  SearchRequest,
  UpdateRequest
} from "../models/advertisement/AdvertisementRequests";
import { baseUrl, headers } from "./SettingsDataLoader";
import { Detail, Category } from "../models/advertisement/Detail";

export const getAdvertisements = async (
  from: number,
  to: number,
  disabled: boolean = false
): Promise<Advertisement[]> => {
  if (disabled) {
    var response = await axios.get<Advertisement[]>(
      baseUrl + "advertisements/disabled/?From=" + from + "&To=" + to
    );
    return response.data;
  } else {
    var response = await axios.get<Advertisement[]>(
      baseUrl + "advertisements/?From=" + from + "&To=" + to
    );
    return response.data;
  }
};

export const getFeaturedAdvertisements = async (
  from: number,
  to: number
): Promise<Advertisement[]> => {
  var response = await axios.get<Advertisement[]>(
    baseUrl + "advertisements/featured/?From=" + from + "&To=" + to
  );
  return response.data;
};

export const searchAdvertisements = async (
  request: SearchRequest,
  from: number,
  to: number,
  disabled: boolean = false
): Promise<Advertisement[]> => {
  if (disabled) {
    var response = await axios.post<Advertisement[]>(
      baseUrl +
        "advertisements/search-by-status?Status=1&From=" +
        from +
        "&To=" +
        to,
      request
    );
    return response.data;
  } else {
    var response = await axios.post<Advertisement[]>(
      baseUrl + "advertisements/search?From=" + from + "&To=" + to,
      request
    );
    return response.data;
  }
};

export const updateAdvertisement = async (
  request: UpdateRequest
): Promise<AdvertisementDetailed> => {
  var id = request.id;
  var response = await axios.put<AdvertisementDetailed>(
    baseUrl + "advertisements/" + id,
    request
  );
  return response.data;
};

export const getMyAdvertisements = async (
  name: string
): Promise<Advertisement[]> => {
  var response = await axios.get<Advertisement[]>(
    baseUrl + "users/" + name + "/advertisements"
  );
  return response.data;
};

export const getAdvertisement = async (
  id: number
): Promise<AdvertisementDetailed> => {
  var response = await axios.get<AdvertisementDetailed>(
    baseUrl + "advertisements/" + id
  );
  return response.data;
};

export const getCustomDetails = async (): Promise<Detail[]> => {
  var response = await axios.get<Detail[]>(baseUrl + "metadetails");
  response.data.forEach(e => {
    e.stringValue = "";
  });
  return response.data;
};

export const createAdvertisement = async (
  request: CreateRequest
): Promise<AdvertisementDetailed> => {
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  var url = baseUrl + "advertisements";
  var response = await axios.post<AdvertisementDetailed>(url, request, {
    headers: headers
  });
  return response.data;
};

export const deleteAdvertisement = async (id: number): Promise<string> => {
  var url = baseUrl + "advertisements/" + id;
  var response = await axios.delete(url, { headers: headers });
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  var response = await axios.get<Category[]>(
    baseUrl + "advertisements/categories"
  );
  return response.data;
};

export const enableAdvertisement = async (id: number) => {
  var url = baseUrl + "advertisements/" + id + "/enable";
  await axios.patch(url, { headers: headers });
};

export const disableAdvertisement = async (id: number) => {
  var url = baseUrl + "advertisements/" + id + "/disable";
  await axios.patch(url, { headers: headers });
};
