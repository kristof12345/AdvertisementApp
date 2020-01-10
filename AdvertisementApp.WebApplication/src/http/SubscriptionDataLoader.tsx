import axios from "axios";
import { ErrorModel } from "../models/common/ErrorModel";
import {
  SubscriptionModel,
  Subscription
} from "../models/subscription/Subscription";
import { SubscriptionRequest } from "../models/subscription/SubscriptionRequest";
import { baseUrl, headers } from "./SettingsDataLoader";

export const getUserSubscription = async (
  name: string
): Promise<Subscription> => {
  var url = baseUrl + "subscription/" + name;
  console.log(name);
  var response = await axios.get<Subscription>(url, { headers: headers });
  response.data.expiryDate = new Date(
    Date.parse(response.data.expiryDate.toString())
  );
  return response.data;
};

export const loadSubscriptions = async (): Promise<SubscriptionModel[]> => {
  var response = await axios.get<SubscriptionModel[]>(baseUrl + "subscription");
  return response.data;
};

export const sendSubscription = async (
  request: SubscriptionRequest
): Promise<ErrorModel> => {
  var response = await axios.post<ErrorModel>(
    baseUrl + "subscription",
    request
  );
  return response.data;
};

export const getMySubscription = async (
  userName: string
): Promise<Subscription> => {
  var response = await axios.get<Subscription>(
    baseUrl + "subscription/" + userName
  );
  return response.data;
};
