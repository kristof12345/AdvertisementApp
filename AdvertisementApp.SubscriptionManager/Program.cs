using AdvertisementApp.BusinessLogic.Services;
using AdvertisementApp.DataBase.Context;
using AdvertisementApp.DataBase.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace AdvertisementApp.SubscriptionManager
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var services = new ServiceCollection();

            //Adatbázis hozzáadása
            services.AddDbContext<DatabaseContext>(ServiceLifetime.Scoped);
            var serviceProvider = services.BuildServiceProvider();
            var Context = serviceProvider.GetRequiredService<DatabaseContext>();

            var subscriptionRepository = new SubscriptionRepository(Context);
            var advertisementRepository = new AdvertisementRepository(Context);
            var paymentService = new DemoPaymentService();
            var SubscriptionService = new SubscriptionService(subscriptionRepository, advertisementRepository, paymentService);

            //Hirdetések megjelenésének frissítése
            await SubscriptionService.UpdateExpiredSubscriptions();
        }
    }
}
