import axios from "axios";
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest
} from "../models/user/UserRequests";
import { Session } from "../models/user/Session";
import { ErrorModel } from "../models/common/ErrorModel";
import { baseUrl, headers } from "./SettingsDataLoader";
import DetailedUser from "../models/user/DetailedUser";

export const loginUser = async (request: LoginRequest): Promise<Session> => {
  return await axios
    .post<Session>(baseUrl + "login", request, {
      headers: headers
    })
    .then(response => {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      console.log("Token: " + response.data.token);
      return response.data;
    })
    .catch(error => {
      let errorModel: ErrorModel;
      if (error.response == undefined)
        errorModel = {
          type: "Login",
          code: "Unable to login!",
          description: "Can't connect to server."
        };
      else
        errorModel = {
          type: "Login",
          code: "Unable to login!",
          description: error.response.data
        };
      let session = new Session();
      session.error = errorModel;
      return session;
    });
};

export const registerUser = async (
  request: RegisterRequest
): Promise<ErrorModel | undefined> => {
  var url = baseUrl + "users";
  return await axios
    .post<ErrorModel>(url, request, { headers: headers })
    .then(response => {
      return undefined;
    })
    .catch(error => {
      if (error.response == undefined)
        return {
          type: "Register",
          code: "Unable to register!",
          description: "Can't connect to server."
        };
      else
        return {
          type: "Register",
          code: "Unable to register!",
          description: error.response.data
        };
    });
};

export const deleteUser = async (name: string): Promise<string> => {
  var url = baseUrl + "users/" + name;
  var response = await axios.delete(url, { headers: headers });
  return response.data;
};

export const changePassword = async (
  request: ChangePasswordRequest
): Promise<string> => {
  var url = baseUrl + "users/" + request.userName + "/password";
  var response = await axios.put<string>(url, request, { headers: headers });
  return response.data;
};

export const loadUserList = async (name: string): Promise<DetailedUser[]> => {
  var url = baseUrl + "users/" + name;
  var response = await axios.get<DetailedUser[]>(url, { headers: headers });
  return response.data;
};

export const enableUser = async (name: string) => {
  var url = baseUrl + "users/" + name + "/enable";
  await axios.patch(url, { headers: headers });
};

export const disableUser = async (name: string) => {
  var url = baseUrl + "users/" + name + "/disable";
  await axios.patch(url, { headers: headers });
};
