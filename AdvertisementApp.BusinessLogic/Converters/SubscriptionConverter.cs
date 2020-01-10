using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Models.Subscriptions;

namespace AdvertisementApp.BusinessLogic.Converters
{
    public static class SubscriptionConverter
    {
        public static SubscriptionDTO ToDTO(this Subscription subscription)
        {
            var dto = new SubscriptionDTO
            {
                Model = subscription.Model,
                ExpiryDate = subscription.ExpiryDate
            };
            return dto;
        }
    }
}
