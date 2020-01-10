using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;

namespace AdvertisementApp.BusinessLogic.Converters
{
    public static class AdvertisementConverter
    {
        // Basic
        public static AdvertisementBasicDTO ToBasicDTO(this Advertisement advertisement)
        {
            var dto = Mapper.Map<AdvertisementBasicDTO>(advertisement);
            return dto;
        }

        public static IEnumerable<AdvertisementBasicDTO> ToBasicDTO(this IEnumerable<Advertisement> advertisementList)
        {
            return advertisementList.Select(adv => adv.ToBasicDTO());
        }

        // Detailed
        public static AdvertisementDetailedDTO ToDetailedDTO(this Advertisement advertisement)
        {
            var dto = Mapper.Map<AdvertisementDetailedDTO>(advertisement);
            dto.ImageList = advertisement.Images.Select(a => a.File);
            dto.Details = advertisement.Details.Select(d => d.ToDTO()).ToList();
            if (advertisement.Category != null)
            {
                dto.CategoryId = advertisement.Category.Id;
                dto.CategoryName = advertisement.Category.Name;
            }
            return dto;
        }

        public static IEnumerable<AdvertisementDetailedDTO> ToDetailedDTO(this IEnumerable<Advertisement> advertisementList)
        {
            return advertisementList.Select(adv => adv.ToDetailedDTO());
        }

        // Requests
        public static Advertisement FromDTO(this CreateAdvertisementRequest dto)
        {
            var advertisement = Mapper.Map<Advertisement>(dto);
            return advertisement;
        }

        public static Advertisement FromDTO(this UpdateAdvertisementRequest dto)
        {
            var advertisement = Mapper.Map<Advertisement>(dto);
            return advertisement;
        }
    }
}
