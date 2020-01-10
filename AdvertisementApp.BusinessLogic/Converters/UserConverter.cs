using AdvertisementApp.BusinessLogic.Models.Users;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public static class UserConverter
    {
        public static List<UserBasicDTO> ToBasicDTO(this IEnumerable<ApplicationUser> userList)
        {
            var dtoList = new List<UserBasicDTO>();
            foreach (var user in userList) { dtoList.Add(UserBasicDTO.ToDTO(user)); }
            return dtoList;
        }

        public static List<UserDetailedDTO> ToDetailedDTO(this IEnumerable<ApplicationUser> userList)
        {
            var dtoList = new List<UserDetailedDTO>();
            foreach (var user in userList) { dtoList.Add(UserDetailedDTO.ToDTO(user)); }
            return dtoList;
        }
    }
}
