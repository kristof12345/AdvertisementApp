import User from "../user/User";

export class SubscriptionModel {
  id: number = 0;
  name: string = "";
  price: number = 0;
  durationInDays: number = 0;
  advertisementUpload: boolean = false;
  multipleImageUplad: boolean = false;
  normalAdvertisementCount: number = 0;
  featuredAdvertisementCount: number = 0;
  highlightedAdvertisementCount: number = 0;
}

export class Subscription {
  model = new SubscriptionModel();
  payed = false;
  expiryDate = new Date();
  user = new User();
  remainingNormalAdvertisementCount: number = 0;
  remainingHighlightedAdvertisementCount: number = 0;
  remainingFeaturedAdvertisementCount: number = 0;
}

export const remaining = (subscription: Subscription, type: string) => {
  if (subscription == undefined) return 0;
  if (type == "Normal") return subscription.remainingNormalAdvertisementCount;
  if (type == "Highlighted")
    return subscription.remainingHighlightedAdvertisementCount;
  if (type == "Featured")
    return subscription.remainingFeaturedAdvertisementCount;
  return 0;
};
