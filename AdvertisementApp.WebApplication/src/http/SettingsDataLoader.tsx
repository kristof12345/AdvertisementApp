import React from "react";
import axios from "axios";
import { AppSettings } from "../models/common/AppSettings";

export const baseUrl = "https://localhost:5001/api/";

export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

export const generateOptions = (list: string[]) => {
  let items = [];
  for (let i = 0; i < list.length; i++) {
    items.push(<option key={i + 1}>{list[i]}</option>);
  }
  return items;
};

export const loadSettings = async (): Promise<AppSettings> => {
  var url = baseUrl + "settings";
  var response = await axios.get(url, { headers: headers });
  return response.data;
};