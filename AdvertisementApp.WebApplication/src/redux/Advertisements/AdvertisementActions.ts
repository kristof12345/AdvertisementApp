import { ActionCreator, AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import {
  getAdvertisements as getAdvertisementsFromAPI,
  getAdvertisement as getAdvertisementFromAPI,
  getMyAdvertisements as getMyAdvertisementsFromAPI,
  searchAdvertisements as searchAdvertisementsFromAPI,
  getFeaturedAdvertisements as getFeaturedAdvertisementsFromAPI,
  getCategories as getCategoriesFromAPI,
  getCustomDetails as getCustomDetailsFromAPI
} from "../../http/AdvertisementDataLoader";

import {
  IAdvertisementsGetAllAction,
  IAdvertisementsGetMyAction,
  IAdvertisementsSearchAction,
  IAdvertisementsGetSingleAction,
  IAdvertisementsState,
  IAdvertisementsGetFeaturedAction,
  IGetCategoriesAction,
  IGetMetaDetailsAction,
  AdvertisementsActionTypes
} from "./AdvertisementTypes";
import { SearchRequest } from "../../models/advertisement/AdvertisementRequests";

export const getAdvertisements: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IAdvertisementsGetAllAction
  >
> = (from: number, to: number) => {
  return async (dispatch: Dispatch) => {
    const advertisements = await getAdvertisementsFromAPI(from, to);
    return dispatch({
      advertisements,
      isFirstPage: from === 0,
      type: AdvertisementsActionTypes.GETALL
    });
  };
};

export const getFeaturedAdvertisements: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IAdvertisementsGetFeaturedAction
  >
> = (from: number, to: number) => {
  return async (dispatch: Dispatch) => {
    const featuredAdvertisements = await getFeaturedAdvertisementsFromAPI(
      from,
      to
    );
    return dispatch({
      featuredAdvertisements,
      isFirstPage: from === 0,
      type: AdvertisementsActionTypes.GETFEATURED
    });
  };
};

export const getMyAdvertisements: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IAdvertisementsGetMyAction
  >
> = (name: string) => {
  return async (dispatch: Dispatch) => {
    const myAdvertisements = await getMyAdvertisementsFromAPI(name);
    return dispatch({
      myAdvertisements,
      type: AdvertisementsActionTypes.GETMY
    });
  };
};

export const getAdvertisement: ActionCreator<
  ThunkAction<
    Promise<any>,
    IAdvertisementsState,
    null,
    IAdvertisementsGetSingleAction
  >
> = (id: number) => {
  return async (dispatch: Dispatch) => {
    const advertisement = await getAdvertisementFromAPI(id);
    dispatch({
      advertisement,
      type: AdvertisementsActionTypes.GETSINGLE
    });
  };
};

export const searchAdvertisements: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IAdvertisementsSearchAction
  >
> = (searchParams: SearchRequest, from: number, to: number) => {
  return async (dispatch: Dispatch) => {
    var advertisements = await searchAdvertisementsFromAPI(
      searchParams,
      from,
      to
    );
    return dispatch({
      advertisements,
      searchParams,
      isFirstPage: from === 0,
      type: AdvertisementsActionTypes.SEARCH
    });
  };
};

export const getCategories: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IGetCategoriesAction
  >
> = () => {
  return async (dispatch: Dispatch) => {
    var categories = await getCategoriesFromAPI();
    return dispatch({
      categories,
      type: AdvertisementsActionTypes.GETCATEGORIES
    });
  };
};

export const getDetails: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IGetMetaDetailsAction
  >
> = () => {
  return async (dispatch: Dispatch) => {
    var details = await getCustomDetailsFromAPI();
    return dispatch({
      details,
      type: AdvertisementsActionTypes.GETDETAILS
    });
  };
};

export const searchDisabledAdvertisements: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IAdvertisementsState,
    null,
    IAdvertisementsSearchAction
  >
> = (searchParams: SearchRequest, from: number, to: number) => {
  return async (dispatch: Dispatch) => {
    var disabledAdvertisements = await searchAdvertisementsFromAPI(
      searchParams,
      from,
      to,
      true
    );
    return dispatch({
      disabledAdvertisements,
      searchParams,
      isFirstPage: from === 0,
      type: AdvertisementsActionTypes.SEARCHDISABLED
    });
  };
};
