using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.DataBase.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Range = AdvertisementApp.BusinessLogic.Models.Range;

namespace AdvertisementApp.DataBase.Repositories
{
    public class AdvertisementRepository : IAdvertisementRepository
    {
        private readonly DatabaseContext Context;

        public AdvertisementRepository(DatabaseContext context)
        {
            Context = context;
        }

        public async Task<Advertisement> CreateAsync(Advertisement advertisement)
        {
            Context.Attach(advertisement.User);
            Context.Advertisements.Add(advertisement);
            Context.Details.AddRange(advertisement.Details);
            await Context.SaveChangesAsync();
            return advertisement;
        }

        public async Task<Advertisement> DeleteAsync(Advertisement advertisement)
        {
            Context.Advertisements.Update(advertisement);
            advertisement.Status = Status.Deleted;
            await Context.SaveChangesAsync();
            return advertisement;
        }

        public async Task<Advertisement> UpdateAsync(Advertisement advertisement)
        {
            Context.Attach(advertisement.User);
            Context.Advertisements.Update(advertisement);
            Context.Details.UpdateRange(advertisement.Details);
            await Context.SaveChangesAsync();
            return advertisement;
        }

        public async Task<IEnumerable<Advertisement>> UpdateStatusAsync(IEnumerable<Advertisement> advertisements)
        {
            Context.Advertisements.UpdateRange(advertisements);
            await Context.SaveChangesAsync();
            return advertisements;
        }

        public async Task<Advertisement> FindByIdAsync(int id)
        {
            var result = await Context.Advertisements.Include(adv => adv.User).Include(adv => adv.Images).Include(adv => adv.Details).ThenInclude(d => d.Meta).Include(adv => adv.Category).AsNoTracking().FirstOrDefaultAsync(adv => adv.Id == id);
            return result;
        }

        public IEnumerable<Advertisement> Get(Range range)
        {
            return Context.Advertisements.Where(adv => adv.Status != Status.Deleted && adv.Status != Status.Hidden && adv.Status != Status.Disabled).OrderByDescending(adv => adv.Status).Skip(range.From).Take(range.To - range.From);
        }

        public IEnumerable<Advertisement> GetFeatured(Range range)
        {
            return Context.Advertisements.Where(adv => adv.Status == Status.Featured).Skip(range.From).Take(range.To - range.From);
        }

        public IEnumerable<Advertisement> GetDisabled(Range range)
        {
            return Context.Advertisements.Where(adv => adv.Status == Status.Disabled).Skip(range.From).Take(range.To - range.From);
        }

        public IEnumerable<Advertisement> ListByUser(string name, Priority? priority = null)
        {
            if (priority == null)
            {
                return Context.Advertisements.Where(ad => ad.UserName == name && ad.Status != Status.Deleted);
            }
            else
            {
                return Context.Advertisements.Where(ad => ad.UserName == name && ad.Priority == priority);
            }
        }

        public IEnumerable<Advertisement> Search(SearchAdvertisementsRequest request, Range range)
        {
            foreach (Detail rd in request.Details) { if (rd.StringValue == null) { Debug.WriteLine("HIBA!"); rd.StringValue = ""; } }

            //Szűrés
            var result = Context.Advertisements.Include(ad => ad.Details).Where(adv =>
                //A meta adattagok alapján válogatunk
                request.Details.All(
                    rd => (rd.StringValue == "" && rd.NumberValue == 0) ||
                    adv.Details.Any(
                        d => ((d.StringValue == rd.StringValue || rd.StringValue == "") &&
                        d.NumberValue == rd.NumberValue) &&
                        d.MetaId == rd.MetaId)) &&
                //A fix adattagok alapján válogatunk
                (adv.Status != Status.Deleted && adv.Status != Status.Hidden && adv.Status != Status.Disabled) &&
                adv.Title.Contains(request.Title) &&
                (adv.Category.Id == request.CategoryId || request.CategoryId == 0) &&
                adv.Price >= request.MinPrice && adv.Price <= request.MaxPrice &&
                adv.UploadDate >= request.MinDate && adv.UploadDate <= request.MaxDate);

            //Rendezés
            if (request.Order == Order.Ascending)
            {
                result = result.OrderByDescending(adv => adv.Status).ThenBy(getOrderFunc(request.OrderBy));
            }
            else
            {
                result = result.OrderByDescending(adv => adv.Status).ThenByDescending(getOrderFunc(request.OrderBy));
            }

            //Pagelés
            result = result.Skip(range.From).Take(range.To - range.From);

            return result;
        }

        public IEnumerable<Advertisement> SearchByStatus(SearchAdvertisementsRequest request, Range range, Status status)
        {
            foreach (Detail rd in request.Details) { if (rd.StringValue == null) { Debug.WriteLine("HIBA!"); rd.StringValue = ""; } }

            //Szűrés
            var result = Context.Advertisements.Include(ad => ad.Details).Where(adv =>
                //A meta adattagok alapján válogatunk
                request.Details.All(
                    rd => (rd.StringValue == "" && rd.NumberValue == 0) ||
                    adv.Details.Any(
                        d => ((d.StringValue == rd.StringValue || rd.StringValue == "") &&
                        d.NumberValue == rd.NumberValue) &&
                        d.MetaId == rd.MetaId)) &&
                //A fix adattagok alapján válogatunk
                adv.Status == status &&
                adv.Title.Contains(request.Title) &&
                (adv.Category.Id == request.CategoryId || request.CategoryId == 0) &&
                adv.Price >= request.MinPrice && adv.Price <= request.MaxPrice &&
                adv.UploadDate >= request.MinDate && adv.UploadDate <= request.MaxDate);

            //Rendezés
            if (request.Order == Order.Ascending)
            {
                result = result.OrderByDescending(getOrderFunc(request.OrderBy));
            }
            else
            {
                result = result.OrderByDescending(getOrderFunc(request.OrderBy));
            }

            //Pagelés
            result = result.Skip(range.From).Take(range.To - range.From);

            return result;
        }

        private Expression<Func<Advertisement, object>> getOrderFunc(OrderBy orderBy)
        {
            switch (orderBy)
            {
                case OrderBy.Title: return a => a.Title;
                case OrderBy.Price: return a => a.Price;
                case OrderBy.Date: return a => a.UploadDate;
                default: throw new Exception();
            }
        }

        public async Task RemoveImages(Advertisement advertisement)
        {
            var images = Context.Images.Where(img => img.AdvertisementId == advertisement.Id);
            Context.Images.RemoveRange(images);
            await Context.SaveChangesAsync();
        }

        public IEnumerable<Category> GetCategories()
        {
            return Context.Categories;
        }

        public async Task HideAdvertisements(string userName)
        {
            var adsToHide = ListByUser(userName);
            foreach (var ad in adsToHide)
            {
                ad.Status = Status.Hidden;
            }
            Context.UpdateRange(adsToHide);
            await Context.SaveChangesAsync();

        }

        public async Task ShowAdvertisements(string userName)
        {
            var adsToShow = ListByUser(userName);
            foreach (var ad in adsToShow)
            {
                ad.Status = Status.Hidden;
            }
            Context.UpdateRange(adsToShow);
            await Context.SaveChangesAsync();
        }

        public async Task<Advertisement> Disable(int id)
        {
            var advertisement = await Context.Advertisements.FindAsync(id);
            advertisement.Status = Status.Disabled;
            Context.Update(advertisement);
            await Context.SaveChangesAsync();
            return advertisement;
        }

        public async Task<Advertisement> Enable(int id)
        {
            var advertisement = await Context.Advertisements.FindAsync(id);
            advertisement.Status = Status.Hidden;
            Context.Update(advertisement);
            await Context.SaveChangesAsync();
            return advertisement;
        }
    }
}
