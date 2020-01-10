using AdvertisementApp.BusinessLogic.Models.Users;
using System;

namespace AdvertisementApp.BusinessLogic.Models.Subscriptions
{
    public class Subscription
    {
        public int Id { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsAutoRenewed { get; set; }

        public int ModelId { get; set; }
        public SubscriptionModel Model { get; set; }

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}