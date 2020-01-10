import React from "react";
import axios from "axios";
import{baseUrl} from "./SettingsDataLoader"

export const generateOptions = (list: string[]) => {
  let items = [];
  for (let i = 0; i < list.length; i++) {
    items.push(<option tabIndex={i} key={i + 1}>{list[i]}</option>);
  }
  return items;
};

export const submitImages = async (files: File[]): Promise<string[]> => {
  var url = baseUrl + "image";
  var images = [];
  for (var i = 0; i < files.length; i++) {
    var form = new FormData();
    form.append("File", files[i]);
    var res = await axios.post<string>(url, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    images.push(res.data);
  }
  return images;
};

export const deleteImages = async (
  images: string[],
  user: string
): Promise<any> => {
  var url = baseUrl + "image/" + user + "/";
  for (var i = 0; i < images.length; i++) {
    await axios.delete(url + images[i]);
  }
  return;
};