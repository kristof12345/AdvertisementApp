using AdvertisementApp.BusinessLogic.Models;
using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Repositories
{
    public interface IAdvertisementRepository
    {
        IEnumerable<Advertisement> Get(Range range);
        IEnumerable<Advertisement> GetFeatured(Range range);
        IEnumerable<Advertisement> GetDisabled(Range range);
        IEnumerable<Advertisement> Search(SearchAdvertisementsRequest request, Range range);
        IEnumerable<Advertisement> SearchByStatus(SearchAdvertisementsRequest request, Range range, Status status);
        IEnumerable<Advertisement> ListByUser(string userName, Priority? priority = null);
        Task<Advertisement> FindByIdAsync(int id);
        Task<Advertisement> UpdateAsync(Advertisement advertisement);
        Task<Advertisement> CreateAsync(Advertisement advertisement);
        Task<Advertisement> DeleteAsync(Advertisement advertisement);
        Task RemoveImages(Advertisement advertisement);
        IEnumerable<Category> GetCategories();
        Task<IEnumerable<Advertisement>> UpdateStatusAsync(IEnumerable<Advertisement> advertisement);
        Task HideAdvertisements(string userName);
        Task ShowAdvertisements(string userName);
        Task<Advertisement> Disable(int id);
        Task<Advertisement> Enable(int id);

    }
}
