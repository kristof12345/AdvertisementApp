using AdvertisementApp.BusinessLogic.Models.Users;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Repositories
{
    public interface IUserRepository
    {
        Task<ApplicationUser> GetByNameWithDetails(string name);
        Task<ApplicationUser> GetByName(string name);
        Task<List<ApplicationUser>> SearchByName(string name);
        Task<IdentityResult> UpdatePassword(string name, string oldPassword, string newPassword);
        Task<IdentityResult> Create(ApplicationUser user, string password);
        Task<IdentityResult> Delete(string name);
        Task<SignInResult> SignIn(string name, string password);
        Task SignOut();
        Task<IdentityRole> GetUserRole(string name);
        Task<bool> Enable(string name);
        Task<bool> Disable(string name);
    }
}
