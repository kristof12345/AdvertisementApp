using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AutoMapper;

namespace AdvertisementApp.BusinessLogic.Converters
{
    public static class DetailConverter
    {
        public static DetailDTO ToDTO(this Detail detail)
        {
            var dto = Mapper.Map<DetailDTO>(detail);
            return dto;
        }

        public static DetailDTO ToDTO(this MetaDetail detail)
        {
            var dto = Mapper.Map<DetailDTO>(detail);
            dto.MetaId = detail.Id;
            return dto;
        }

        public static Detail FromDTO(DetailDTO dto)
        {
            var detail = Mapper.Map<Detail>(dto);
            return detail;
        }
    }
}
