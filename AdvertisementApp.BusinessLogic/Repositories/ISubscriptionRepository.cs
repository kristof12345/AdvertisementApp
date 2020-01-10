using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Repositories
{
    public interface ISubscriptionRepository
    {
        IEnumerable<SubscriptionModel> GetSubscriptionModels();
        IEnumerable<Subscription> GetExpiredSubscriptions();
        Task<Subscription> FindSubscriptionForUser(string userName);
        Task<SubscriptionResult> Subscribe(string userName, SubscriptionModel subscriptionModel);
        Task<SubscriptionResult> Unsubscribe(string userName);
    }
}
