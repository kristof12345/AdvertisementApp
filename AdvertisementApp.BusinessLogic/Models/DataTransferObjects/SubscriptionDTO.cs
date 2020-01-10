using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using System;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class SubscriptionDTO
    {
        public int Id { get; set; }
        public bool Payed { get; set; }
        public DateTime ExpiryDate { get; set; }

        public UserBasicDTO User { get; set; }
        public int RemainingNormalAdvertisementCount { get; set; }
        public int RemainingHighlightedAdvertisementCount { get; set; }
        public int RemainingFeaturedAdvertisementCount { get; set; }

        public int ModelId { get; set; }
        public SubscriptionModel Model { get; set; }
    }
}