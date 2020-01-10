using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Services
{
    public class MetaDetailService
    {
        private readonly IMetaDetailRepository MetaDetailRepository = null;

        public MetaDetailService(IMetaDetailRepository metaDetailRepository)
        {
            MetaDetailRepository = metaDetailRepository;
        }

        public IEnumerable<MetaDetail> GetAll()
        {
            return MetaDetailRepository.GetAll();
        }

        public async Task<MetaDetail> Find(int id)
        {
            return await MetaDetailRepository.FindAsync(id);
        }
    }
}
