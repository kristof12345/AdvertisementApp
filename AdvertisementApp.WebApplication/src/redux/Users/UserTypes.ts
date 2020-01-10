import { Session } from "../../models/user/Session";
import {
  SubscriptionModel,
  Subscription
} from "../../models/subscription/Subscription";
import DetailedUser from "../../models/user/DetailedUser";

//Actions
export enum UserActionTypes {
  LOGIN = "USERS/LOGIN",
  REGISTER = "USERS/REGISTER",
  GETMYSUBSCRIPTION = "USERS/GETMYSUBSCRIPTION",
  LOAD_SUBSCRIPTIONS = "USERS/LOADSUBSCRIPTIONS",
  GETDETAILS = "USERS/GETDETAILS",
  LIST_USERS = "USERS/LISTUSERS",
  ENABLE_USER = "USERS/ENABLE",
  DISABLE_USER = "USERS/DISABLE"
}

export interface IUsersLoginAction {
  type: UserActionTypes.LOGIN;
  session: Session;
}

export interface IUsersRegisterAction {
  type: UserActionTypes.REGISTER;
  session: Session;
}

export interface ILoadSubscriptionsAction {
  type: UserActionTypes.LOAD_SUBSCRIPTIONS;
  subscriptions: SubscriptionModel[];
}

export interface IUsersGetDetailsAction {
  type: UserActionTypes.GETDETAILS;
  details: Subscription;
}

export interface IUsersListAction {
  type: UserActionTypes.LIST_USERS;
  userList: DetailedUser[];
}

export interface IUsersEnableAction {
  type: UserActionTypes.ENABLE_USER;
}

export interface IUsersDisableAction {
  type: UserActionTypes.DISABLE_USER;
}

//Union Type (az actionok úniója)
export type UsersActions =
  | IUsersLoginAction
  | IUsersRegisterAction
  | ILoadSubscriptionsAction
  | IUsersGetDetailsAction
  | IUsersListAction
  | IUsersEnableAction
  | IUsersDisableAction;

//State (a globálisan tárolt állapot)
export interface IUsersState {
  readonly session: Session;
  readonly details: Subscription;
  readonly subscriptions: SubscriptionModel[];
  readonly userList?: DetailedUser[];
}
