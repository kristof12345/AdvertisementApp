using AdvertisementApp.BusinessLogic.Models.Users;
using AutoMapper;
using System;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class UserDetailedDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime RegistrationDate { get; set; }
        public UserStatus Status { get; set; }
        public string SubscriptionName { get; set; }

        public static ApplicationUser FromDTO(UserDetailedDTO dto)
        {
            var user = Mapper.Map<ApplicationUser>(dto);
            return user;
        }

        public static UserDetailedDTO ToDTO(ApplicationUser user)
        {
            var dto = Mapper.Map<UserDetailedDTO>(user);
            dto.SubscriptionName = user.Subscription?.Model?.Name;
            return dto;
        }
    }
}
