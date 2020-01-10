using AdvertisementApp.BusinessLogic.Converters;
using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Services
{
    //Hirdetések kezeléséért felelős szolgáltatás
    public class AdvertisementService
    {
        private readonly IAdvertisementRepository AdvertisementRepository = null;
        private readonly IUserRepository UserRepository = null;
        private readonly IFileRepository ImageRepository = null;
        private readonly IMetaDetailRepository MetaDetailRepository = null;

        public AdvertisementService(IAdvertisementRepository advertisementRepository, IUserRepository userRepository, IFileRepository imageRepository, IMetaDetailRepository metaDetailRepository)
        {
            AdvertisementRepository = advertisementRepository;
            UserRepository = userRepository;
            ImageRepository = imageRepository;
            MetaDetailRepository = metaDetailRepository;
        }

        // Hirdetés létrehozása
        public async Task<AdvertisementDetailedDTO> CreateAdvertisement(string userName, CreateAdvertisementRequest request)
        {
            var advertisement = request.FromDTO();
            foreach (var detail in advertisement.Details)
            {
                detail.Id = 0;
            }

            //Felhasználó beállítása
            var user = await UserRepository.GetByNameWithDetails(userName);
            advertisement.User = user;
            advertisement.UserName = user.UserName;

            //Dátum beállítása
            advertisement.UploadDate = DateTime.Today;

            //Képek beállítása
            foreach (string image in request.ImageList)
            {
                advertisement.Images.Add(new Image { File = image });
            }

            //Előfizetés ellenőrzése
            bool success = SubscriptionService.CheckSubscription(user, advertisement);

            //Validáció
            bool valid = await ValidateAsync(advertisement);

            if (success && valid)
            {
                advertisement.Status = advertisement.Priority.ToStatus();
                await AdvertisementRepository.CreateAsync(advertisement);
                return advertisement.ToDetailedDTO();
            }
            return null;
        }

        // Hirdetés törlése
        public async Task<AdvertisementDetailedDTO> DeleteAdvertisement(string userName, int id)
        {
            var advertisement = await AdvertisementRepository.FindByIdAsync(id);

            // Ha helytelen a felhasználónév
            if (advertisement.UserName != userName)
                return null;

            await AdvertisementRepository.DeleteAsync(advertisement);

            //Képek törlése
            foreach (var image in advertisement.Images)
            {
                ImageRepository.Delete(image.File, advertisement.UserName);
            }
            return advertisement.ToDetailedDTO();
        }

        // Hirdetés módosítása
        public async Task<AdvertisementDetailedDTO> UpdateAdvertisement(string userName, int id, UpdateAdvertisementRequest request)
        {
            var advertisement = await AdvertisementRepository.FindByIdAsync(id);
            // Ha helytelen a felhasználónév
            if (advertisement.UserName != userName)
                return null;

            advertisement = request.FromDTO();
            advertisement.Id = id;
            advertisement.User = await UserRepository.GetByName(userName);
            advertisement.UserName = userName;

            //Képek frissítése
            if (request.ImagesChanged)
            {
                await AdvertisementRepository.RemoveImages(advertisement);
                foreach (string image in request.ImageList)
                {
                    advertisement.Images.Add(new Image { File = image });
                }
            }

            //Validáció
            bool valid = await ValidateAsync(advertisement, request.ImagesChanged);

            //Előfizetés ellenőrzése
            bool success = SubscriptionService.CheckSubscription(advertisement.User, advertisement);

            if (valid && success)
            {
                advertisement.Status = advertisement.Priority.ToStatus();
                var result = await AdvertisementRepository.UpdateAsync(advertisement);
                return result.ToDetailedDTO();
            }
            return null;
        }

        // Hirdetés letiltása
        public async Task<Advertisement> Disable(int id)
        {
            return await AdvertisementRepository.Disable(id);
        }

        // Hirdetés engedélyezése
        public async Task<Advertisement> Enable(int id)
        {
            return await AdvertisementRepository.Enable(id);
        }

        // Hirdetések listázása
        public IEnumerable<AdvertisementBasicDTO> GetRange(Models.Range range)
        {
            var list = AdvertisementRepository.Get(range);
            return list.ToBasicDTO();
        }

        // Főoldali hirdetések listázása
        public IEnumerable<AdvertisementBasicDTO> GetFeatured(Models.Range range)
        {
            var list = AdvertisementRepository.GetFeatured(range);
            return list.ToBasicDTO();
        }

        // Letiltott hirdetések listázása
        public IEnumerable<AdvertisementBasicDTO> GetDisabled(Models.Range range)
        {
            var list = AdvertisementRepository.GetDisabled(range);
            return list.ToBasicDTO();
        }

        // Keresés a hirdetések között
        public IEnumerable<AdvertisementBasicDTO> Search(Models.Range range, SearchAdvertisementsRequest request)
        {
            var list = AdvertisementRepository.Search(request, range);
            return list.ToBasicDTO();
        }

        // Keresés a hirdetések között státusz alapján
        public IEnumerable<AdvertisementBasicDTO> SearchByStatus(Models.Range range, SearchAdvertisementsRequest request, Status status)
        {
            var list = AdvertisementRepository.SearchByStatus(request, range, status);
            return list.ToBasicDTO();
        }

        // Egy hirdetés részleteinek lekérése
        public async Task<AdvertisementDetailedDTO> GetAdvertisement(int id)
        {
            var advertisement = await AdvertisementRepository.FindByIdAsync(id);
            var advertisementDTO = advertisement.ToDetailedDTO();
            for (int i = 0; i < advertisement.Details.Count; i++)
            {
                var dto = advertisementDTO.Details.ToArray()[i];
                var detail = advertisement.Details.ToArray()[i];

                dto.Name = detail.Meta.Name;
                dto.Type = detail.Meta.Type;
                dto.Importance = detail.Meta.Importance;
                dto.Required = detail.Meta.Required;
                dto.PossibleValues = detail.Meta.PossibleValues;
            }
            return advertisementDTO;
        }

        // Kategóriák listázása
        public IEnumerable<Category> GetCategories()
        {
            return AdvertisementRepository.GetCategories();
        }

        // Validáció
        private async Task<bool> ValidateAsync(Advertisement advertisement, bool checkImages = true)
        {
            if (advertisement.Title.Length < 5 || advertisement.Title.Length > 20)
                return false;
            if (advertisement.Description.Length > 500)
                return false;
            if (advertisement.Price < 0)
                return false;
            if (checkImages && (advertisement.Images.Count < 1 || advertisement.Images.Count > 10))
                return false;
            //Részletek ellenőrzése
            foreach (var detail in advertisement.Details)
            {
                var meta = await MetaDetailRepository.FindAsync(detail.MetaId);
                if (meta.Required && meta.Type != MetaType.Number && detail.StringValue == "")
                {
                    return false;
                }
            }
            //Ha minden rendben van
            return true;
        }
    }
}