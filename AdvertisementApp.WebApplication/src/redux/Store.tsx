import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import thunk from "redux-thunk";

import { advertisementsReducer } from "./Advertisements/AdvertisementReducers";
import { IAdvertisementsState } from "./Advertisements/AdvertisementTypes";
import { usersReducer } from "./Users/UserReducers";
import { IUsersState } from "./Users/UserTypes";

export interface IApplicationState {
  advertisements: IAdvertisementsState;
  users: IUsersState;
}

const rootReducer = combineReducers<IApplicationState>({
  advertisements: advertisementsReducer,
  users: usersReducer
});

export default function configureStore(): Store<IApplicationState> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}
