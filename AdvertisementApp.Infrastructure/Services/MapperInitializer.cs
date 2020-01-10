using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Models.Users;
using AutoMapper;

namespace AdvertisementApp.Infrastructure.Services
{
    public class MapperInitializer
    {
        public static void InitializeMapper()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<CreateAdvertisementRequest, Advertisement>();
                cfg.CreateMap<Advertisement, AdvertisementBasicDTO>();
                cfg.CreateMap<UpdateAdvertisementRequest, Advertisement>();
                cfg.CreateMap<Advertisement, AdvertisementDetailedDTO>();
                cfg.CreateMap<UserBasicDTO, ApplicationUser>();
                cfg.CreateMap<ApplicationUser, UserBasicDTO>();
                cfg.CreateMap<UserDetailedDTO, ApplicationUser>();
                cfg.CreateMap<ApplicationUser, UserDetailedDTO>();
                cfg.CreateMap<DetailDTO, Detail>();
                cfg.CreateMap<Detail, DetailDTO>();
                cfg.CreateMap<DetailDTO, MetaDetail>();
                cfg.CreateMap<MetaDetail, DetailDTO>();
            });
        }
    }
}
