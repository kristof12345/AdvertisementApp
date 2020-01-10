using AdvertisementApp.BusinessLogic.Converters;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Services
{
    //Előfizetéseket kezelő szolgáltatás
    public class SubscriptionService
    {

        private readonly ISubscriptionRepository SubscriptionRepository = null;
        private readonly IAdvertisementRepository AdvertisementRepository = null;
        private readonly IPaymentService PaymentService = null;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository, IAdvertisementRepository advertisementRepository, IPaymentService paymentService)
        {
            SubscriptionRepository = subscriptionRepository;
            AdvertisementRepository = advertisementRepository;
            PaymentService = paymentService;
        }

        // Feliratkozás egy előfizetésre
        public async Task<Subscription> Subscribe(string userName, SubscriptionModel subscriptionModel)
        {
            var payementSuccess = PaymentService.PaySubscription(userName, subscriptionModel.Price);
            if (payementSuccess)
            {
                var result = await SubscriptionRepository.Subscribe(userName, subscriptionModel);
                if (result.Success)
                {
                    await UpdateSubscriptionAsync(result.Subscription);
                    return result.Subscription;
                }
            }
            return null;
        }

        // Leiratkozás egy előfizetésről
        public async Task<Subscription> Unsubscribe(string userName, SubscriptionModel subscription)
        {
            var result = await SubscriptionRepository.Unsubscribe(userName);
            if (result.Success)
            {
                await UpdateSubscriptionAsync(result.Subscription);
            }
            return result.Subscription;
        }

        // Előfizetési modellek lekérése
        public IEnumerable<SubscriptionModel> GetModels()
        {
            return SubscriptionRepository.GetSubscriptionModels();
        }

        // Egy felhasználó előfizetésének lekérése
        public async Task<SubscriptionDTO> GetSubscriptionForUser(string name)
        {
            var subscription = await SubscriptionRepository.FindSubscriptionForUser(name);
            var dto = subscription.ToDTO();
            dto.RemainingNormalAdvertisementCount = subscription.Model.NormalAdvertisementCount - AdvertisementRepository.ListByUser(name, Priority.Normal).Count();
            dto.RemainingHighlightedAdvertisementCount = subscription.Model.HighlightedAdvertisementCount - AdvertisementRepository.ListByUser(name, Priority.Highlighted).Count();
            dto.RemainingFeaturedAdvertisementCount = subscription.Model.FeaturedAdvertisementCount - AdvertisementRepository.ListByUser(name, Priority.Featured).Count();
            return dto;
        }

        // Egy hirdetés ellenőrzése, hogy megfelel-e a felhasználó előfizetésének
        public static bool CheckSubscription(ApplicationUser user, Advertisement advertisement)
        {
            var model = user.Subscription.Model;

            //Ha már túl sok hirdetést töltött fel
            if (model.NormalAdvertisementCount <= user.Advertisements.Count && advertisement.Priority == Priority.Normal) return false;
            //Ha már túl sok főoldali hirdetést töltött fel
            if (model.FeaturedAdvertisementCount <= user.Advertisements.Where(a => a.Status == Status.Featured).Count() && advertisement.Priority == Priority.Featured) return false;
            //Ha már túl sok kiemelt hirdetést töltött fel
            if (model.HighlightedAdvertisementCount <= user.Advertisements.Where(a => a.Status == Status.Highlighted).Count() && advertisement.Priority == Priority.Highlighted) return false;
            //Ha nem tölthetne fel több képet
            if (model.MultipleImageUpload == false && advertisement.Images.Count > 1) return false;
            //Egyébként érvényes
            return true;
        }

        // A lejárt előfizetésekhez tartozó hirdetések megjelenésének frissítése
        public async Task UpdateExpiredSubscriptions()
        {
            //Az összes lejárt előfizetést megújítja
            var expiredSubscriptions = SubscriptionRepository.GetExpiredSubscriptions();
            foreach (var subscription in expiredSubscriptions)
            {
                if (subscription.IsAutoRenewed) { var result = await Subscribe(subscription.User.UserName, subscription.Model); }
                await UpdateSubscriptionAsync(subscription);
            }
        }

        // Egy felhasználó hirdetéseinek frissítése az előfizetésének megfelelően
        public async Task UpdateUserSubscription(string name)
        {
            var subscription = await SubscriptionRepository.FindSubscriptionForUser(name);
            await UpdateSubscriptionAsync(subscription);
        }

        // Egy előfizetéshez tartozó hirdetések megjelenésének frissítése
        private async Task UpdateSubscriptionAsync(Subscription subscription)
        {
            if (subscription.User.Enabled)
            {
                //A felhasználó hirdetéseit frissíti az előfizetés változásakor
                var advertisements = AdvertisementRepository.ListByUser(subscription.User.UserName);

                await UpdateAdvertisementsStatus(subscription.Model, advertisements);
            }
        }

        private async Task UpdateAdvertisementsStatus(SubscriptionModel model, IEnumerable<Advertisement> advertisements)
        {
            int featured = 0;
            int highlighted = 0;
            int normal = 0;

            foreach (var adv in advertisements)
            {
                switch (adv.Priority)
                {
                    case Priority.Featured:
                        // Csökkenő sorrendben próbáljuk a kiemeléseket
                        if (featured < model.FeaturedAdvertisementCount)
                        {
                            adv.Status = Status.Featured;
                            featured++;
                            break;
                        }
                        if (highlighted < model.HighlightedAdvertisementCount)
                        {
                            adv.Status = Status.Highlighted;
                            highlighted++;
                            break;
                        }
                        if (normal < model.NormalAdvertisementCount)
                        {
                            adv.Status = Status.Displayed;
                            normal++;
                            break;
                        }
                        adv.Status = Status.Hidden;
                        break;
                    case Priority.Highlighted:
                        // Csökkenő sorrendben próbáljuk a kiemeléseket
                        if (highlighted < model.HighlightedAdvertisementCount)
                        {
                            adv.Status = Status.Highlighted;
                            highlighted++;
                            break;
                        }
                        if (normal < model.NormalAdvertisementCount)
                        {
                            adv.Status = Status.Displayed;
                            normal++;
                            break;
                        }
                        adv.Status = Status.Hidden;
                        break;
                    case Priority.Normal:
                        // Csökkenő sorrendben próbáljuk a kiemeléseket
                        if (normal < model.NormalAdvertisementCount)
                        {
                            adv.Status = Status.Displayed;
                            normal++;
                            break;
                        }
                        adv.Status = Status.Hidden;
                        break;
                }
            }
            await AdvertisementRepository.UpdateStatusAsync(advertisements);
        }
    }
}