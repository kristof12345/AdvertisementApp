import { Reducer } from "redux";
import {
  IAdvertisementsState,
  AdvertisementsActions,
  AdvertisementsActionTypes
} from "./AdvertisementTypes";

//Kezdőállapot  (üres tömb, stb...)
const initialAdvertisementState: IAdvertisementsState = {
  advertisements: [],
  featuredAdvertisements: [],
  myAdvertisements: [],
  disabledAdvertisements: [],
  currentAdvertisement: null,
  searchParams: {},
  categories: [],
  details: []
};

//A különböző actionök kezelése
export const advertisementsReducer: Reducer<
  IAdvertisementsState,
  AdvertisementsActions
> = (state = initialAdvertisementState, action) => {
  switch (action.type) {
    case AdvertisementsActionTypes.GETMY: {
      return {
        ...state,
        myAdvertisements: action.myAdvertisements
      };
    }
    case AdvertisementsActionTypes.GETALL: {
      return {
        ...state,
        advertisements: action.isFirstPage
          ? action.advertisements
          : state.advertisements.concat(action.advertisements)
      };
    }
    case AdvertisementsActionTypes.GETSINGLE: {
      return {
        ...state,
        currentAdvertisement: action.advertisement
      };
    }
    case AdvertisementsActionTypes.SEARCH: {
      return {
        ...state,
        advertisements: action.isFirstPage
          ? action.advertisements
          : state.advertisements.concat(action.advertisements),
        searchParams: action.searchParams
      };
    }
    case AdvertisementsActionTypes.SEARCHDISABLED: {
      return {
        ...state,
        disabledAdvertisements: action.isFirstPage
          ? action.disabledAdvertisements
          : state.disabledAdvertisements.concat(action.disabledAdvertisements),
        searchParams: action.searchParams
      };
    }
    case AdvertisementsActionTypes.GETFEATURED: {
      return {
        ...state,
        featuredAdvertisements: action.isFirstPage
          ? action.featuredAdvertisements
          : state.featuredAdvertisements.concat(action.featuredAdvertisements)
      };
    }
    case AdvertisementsActionTypes.GETCATEGORIES: {
      return {
        ...state,
        categories: action.categories
      };
    }
    case AdvertisementsActionTypes.GETDETAILS: {
      return {
        ...state,
        details: action.details
      };
    }
  }
  return state;
};
