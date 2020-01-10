import { ErrorModel } from "../common/ErrorModel";

export enum UserStatus {
  New,
  Registered,
  LoggedIn
}

export enum UserType {
  User,
  Admin
}

export class Session {
  status: UserStatus = UserStatus.New;
  userType: UserType = UserType.User;
  username: string ="";
  success: boolean =false;
  token: string ="";
  error?: ErrorModel;
}
