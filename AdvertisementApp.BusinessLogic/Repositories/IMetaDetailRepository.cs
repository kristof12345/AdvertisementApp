using AdvertisementApp.BusinessLogic.Models.Advertisements;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Repositories
{
    public interface IMetaDetailRepository
    {
        IEnumerable<MetaDetail> GetAll();
        Task<MetaDetail> Remove(int id);
        Task Add(MetaDetail customMetaDetail);
        Task<MetaDetail> FindAsync(int id);
        Task<MetaDetail> FindByNameAsync(string name);
    }
}
