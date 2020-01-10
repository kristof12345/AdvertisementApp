import { Advertisement } from "../../models/advertisement/AdvertisementBasic";
import { Advertisement as AdvertisementDetailed } from "../../models/advertisement/AdvertisementDetailed";
import { SearchRequest } from "../../models/advertisement/AdvertisementRequests";
import { Category, Detail } from "../../models/advertisement/Detail";

//Actions
export enum AdvertisementsActionTypes {
  GETALL = "ADVERTISEMENTS/GETALL",
  GETMY = "ADVERTISEMENTS/GETMY",
  SEARCH = "ADVERTISEMENT/SEARCH",
  GETSINGLE = "ADVERTISEMENTS/GETSINGLE",
  GETFEATURED = "ADVERTISEMENTS/GETFEATURED",
  GETCATEGORIES = "ADVERTISEMENT/GETCATEGORIES",
  GETDETAILS = "ADVERTISEMENT/GETDETAILS",
  SEARCHDISABLED = "ADVERTISEMENT/SEARCHDISABLED"
}

export interface IAdvertisementsGetAllAction {
  type: AdvertisementsActionTypes.GETALL;
  advertisements: Advertisement[];
  isFirstPage: boolean;
}

export interface IAdvertisementsGetFeaturedAction {
  type: AdvertisementsActionTypes.GETFEATURED;
  featuredAdvertisements: Advertisement[];
  isFirstPage: boolean;
}

export interface IAdvertisementsGetMyAction {
  type: AdvertisementsActionTypes.GETMY;
  myAdvertisements: Advertisement[];
}

export interface IAdvertisementsSearchAction {
  type: AdvertisementsActionTypes.SEARCH;
  advertisements: Advertisement[];
  searchParams: SearchRequest;
  isFirstPage: boolean;
}

export interface IAdvertisementsSearchDisabledAction {
  type: AdvertisementsActionTypes.SEARCHDISABLED;
  disabledAdvertisements: Advertisement[];
  searchParams: SearchRequest;
  isFirstPage: boolean;
}

export interface IAdvertisementsGetSingleAction {
  type: AdvertisementsActionTypes.GETSINGLE;
  advertisement: AdvertisementDetailed;
}

export interface IGetCategoriesAction {
  type: AdvertisementsActionTypes.GETCATEGORIES;
  categories: Category[];
}

export interface IGetMetaDetailsAction {
  type: AdvertisementsActionTypes.GETDETAILS;
  details: Detail[];
}

//Union Type (az actionok úniója)
export type AdvertisementsActions =
  | IAdvertisementsGetAllAction
  | IAdvertisementsSearchAction
  | IAdvertisementsGetSingleAction
  | IAdvertisementsGetMyAction
  | IAdvertisementsGetFeaturedAction
  | IGetCategoriesAction
  | IGetMetaDetailsAction
  | IAdvertisementsSearchDisabledAction;

//State (a globálisan tárolt állapot)
export interface IAdvertisementsState {
  readonly advertisements: Advertisement[];
  readonly featuredAdvertisements: Advertisement[];
  readonly myAdvertisements: Advertisement[];
  readonly disabledAdvertisements: Advertisement[];
  readonly searchParams: SearchRequest;
  readonly currentAdvertisement: AdvertisementDetailed | null;
  readonly categories: Category[];
  readonly details: Detail[];
}
