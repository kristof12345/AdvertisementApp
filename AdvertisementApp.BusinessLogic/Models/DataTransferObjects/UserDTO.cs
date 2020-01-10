using AdvertisementApp.BusinessLogic.Models.Users;
using AutoMapper;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class UserBasicDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public static ApplicationUser FromDTO(UserBasicDTO dto)
        {
            var user = Mapper.Map<ApplicationUser>(dto);
            return user;
        }

        public static UserBasicDTO ToDTO(ApplicationUser user)
        {
            var dto = Mapper.Map<UserBasicDTO>(user);
            return dto;
        }
    }
}