import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import {
  loginUser as loginUserFromAPI,
  registerUser as registerUserFromAPI,
  loadUserList as loadUserListFromAPI,
  enableUser as enableUserFromAPI,
  disableUser as disableUserFromAPI
} from "../../http/UserDataLoader";
import {
  loadSubscriptions as loadSubcsriptionsFromAPI,
  getUserSubscription as getUserDetailsFromAPI
} from "../../http/SubscriptionDataLoader";
import {
  IUsersLoginAction,
  IUsersState,
  ILoadSubscriptionsAction,
  UserActionTypes,
  IUsersGetDetailsAction
} from "./UserTypes";
import { LoginRequest, RegisterRequest } from "../../models/user/UserRequests";
import { Session, UserStatus } from "../../models/user/Session";

export const loginUser: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, IUsersLoginAction>
> = (request: LoginRequest) => {
  return async (dispatch: Dispatch) => {
    const session = await loginUserFromAPI(request);
    dispatch({
      session,
      type: UserActionTypes.LOGIN
    });
  };
};

export const registerUser: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, IUsersLoginAction>
> = (request: RegisterRequest) => {
  return async (dispatch: Dispatch) => {
    const error = await registerUserFromAPI(request);
    var session = new Session();
    //Ha sikeres (akkor nincs error)
    if (error == null) {
      session.status = UserStatus.Registered;
      session.success = true;
    }
    session.error = error;
    dispatch({
      session,
      type: UserActionTypes.REGISTER
    });
  };
};

export const loadSubscriptions: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, ILoadSubscriptionsAction>
> = () => {
  return async (dispatch: Dispatch) => {
    const subscriptions = await loadSubcsriptionsFromAPI();
    dispatch({
      subscriptions,
      type: UserActionTypes.LOAD_SUBSCRIPTIONS
    });
  };
};

export const loadUserList: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, ILoadSubscriptionsAction>
> = (name: string) => {
  return async (dispatch: Dispatch) => {
    const userList = await loadUserListFromAPI(name);
    dispatch({
      userList,
      type: UserActionTypes.LIST_USERS
    });
  };
};

export const getUserDetails: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, IUsersGetDetailsAction>
> = (userName: string) => {
  return async (dispatch: Dispatch) => {
    const details = await getUserDetailsFromAPI(userName);
    dispatch({
      details,
      type: UserActionTypes.GETDETAILS
    });
  };
};

export const enableUser: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, IUsersGetDetailsAction>
> = (userName: string) => {
  return async (dispatch: Dispatch) => {
    const details = await enableUserFromAPI(userName);
    dispatch({
      details,
      type: UserActionTypes.ENABLE_USER
    });
  };
};

export const disableUser: ActionCreator<
  ThunkAction<Promise<any>, IUsersState, null, IUsersGetDetailsAction>
> = (userName: string) => {
  return async (dispatch: Dispatch) => {
    const details = await disableUserFromAPI(userName);
    dispatch({
      details,
      type: UserActionTypes.DISABLE_USER
    });
  };
};
