
namespace AdvertisementApp.BusinessLogic.Services
{
    public interface IPaymentService
    {
        bool PaySubscription(string userName, int price);
    }
}
