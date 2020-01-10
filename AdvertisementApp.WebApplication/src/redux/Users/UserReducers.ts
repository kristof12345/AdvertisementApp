import { Reducer } from "redux";
import { IUsersState, UsersActions, UserActionTypes } from "./UserTypes";
import { Session, UserStatus } from "../../models/user/Session";
import { Subscription } from "../../models/subscription/Subscription";

//Kezdőállapot  (üres tömb, stb...)
const initialUserState: IUsersState = {
  session: new Session(),
  details: new Subscription(),
  subscriptions: []
};

//A különböző actionök kezelése
export const usersReducer: Reducer<IUsersState, UsersActions> = (
  state = initialUserState,
  action
) => {
  switch (action.type) {
    case UserActionTypes.LOGIN: {
      var session: Session;
      if (action.session.success) {
        session = action.session;
        session.status = UserStatus.LoggedIn;
      } else {
        session = new Session();
        session.error = action.session.error;
      }
      return {
        ...state,
        session: session
      };
    }
    case UserActionTypes.REGISTER: {
      var session = new Session();
      session.error = action.session.error;
      if (action.session.success) {
        session.status = UserStatus.Registered;
        return {
          ...state,
          session: session
        };
      } else {
        return {
          ...state,
          session: session
        };
      }
    }
    case UserActionTypes.LOAD_SUBSCRIPTIONS: {
      return {
        ...state,
        subscriptions: action.subscriptions
      };
    }
    case UserActionTypes.GETDETAILS: {
      return {
        ...state,
        details: action.details
      };
    }
    case UserActionTypes.LIST_USERS: {
      return {
        ...state,
        userList: action.userList
      };
    }
  }
  return state;
};
