using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.DataBase.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvertisementApp.DataBase.Repositories
{
    public class MetaDetailRepository : IMetaDetailRepository
    {
        private readonly DatabaseContext Context;

        public MetaDetailRepository(DatabaseContext context)
        {
            Context = context;
        }

        //ADD
        public async Task Add(MetaDetail customMetaDetail)
        {
            Context.MetaDetails.Add(customMetaDetail);
            await Context.SaveChangesAsync();
        }

        //FIND
        public async Task<MetaDetail> FindAsync(int id)
        {
            return await Context.MetaDetails.FindAsync(id);
        }

        //FINDBYNAME
        public async Task<MetaDetail> FindByNameAsync(string name)
        {
            return await Context.MetaDetails.FirstAsync(d => d.Name == name);
        }

        //GET
        public IEnumerable<MetaDetail> GetAll()
        {
            return Context.MetaDetails;
        }

        //DELETE
        public async Task<MetaDetail> Remove(int id)
        {
            var metaDetail = await Context.MetaDetails.FindAsync(id);
            Context.MetaDetails.Remove(metaDetail);
            await Context.SaveChangesAsync();

            return metaDetail;
        }

        //ANY
        private bool CustomMetaDetailExists(int id)
        {
            return Context.MetaDetails.Any(e => e.Id == id);
        }
    }
}
