using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.DataBase.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvertisementApp.DataBase.Repositories
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly DatabaseContext Context;

        public SubscriptionRepository(DatabaseContext context)
        {
            Context = context;
        }

        public IEnumerable<SubscriptionModel> GetSubscriptionModels()
        {
            return Context.SubscriptionModels;
        }

        public IEnumerable<Subscription> GetExpiredSubscriptions()
        {
            return Context.Subscriptions.Include(s => s.User).Include(s => s.Model).Where(s => s.ExpiryDate < DateTime.Today);
        }

        public async Task<Subscription> FindSubscriptionForUser(string userName)
        {
            return await Context.Subscriptions.Include(s => s.User).Include(s => s.Model).FirstAsync(s => s.User.UserName == userName);
        }

        public async Task<SubscriptionResult> Subscribe(string userName, SubscriptionModel model)
        {
            var subscription = await FindSubscriptionForUser(userName);
            Context.Attach(model);
            subscription.ExpiryDate = DateTime.Today.AddDays(model.DurationInDays);
            subscription.Model = model;
            Context.Subscriptions.Update(subscription);
            await Context.SaveChangesAsync();

            return new SubscriptionResult { Success = true, Subscription = subscription };
        }

        public async Task<SubscriptionResult> Unsubscribe(string userName)
        {
            var subscription = await FindSubscriptionForUser(userName);
            Context.Subscriptions.Remove(subscription);
            await Context.SaveChangesAsync();
            return new SubscriptionResult { Success = true };
        }
    }
}
