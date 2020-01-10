using AdvertisementApp.BusinessLogic.Converters;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Models.UserRequests;
using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Repositories;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AdvertisementApp.BusinessLogic.Services
{
    //A felhasználókezelést végző szolgáltatás
    public class UserService
    {
        private readonly IUserRepository UserRepository = null;
        private readonly IAdvertisementRepository AdvertisementRepository = null;
        private readonly IFileRepository ImageRepository = null;

        public UserService(IUserRepository userRepository, IAdvertisementRepository advertisementRepository, IFileRepository imageRepository)
        {
            UserRepository = userRepository;
            AdvertisementRepository = advertisementRepository;
            ImageRepository = imageRepository;
        }

        // Bejelentkezés
        public async Task<(Session session, string message)> Login(LoginRequest request)
        {
            var result = await UserRepository.SignIn(request.UserName, request.Password);
            //Ha sikeres a bejelentkezés
            if (result.Succeeded)
            {
                var type = await GetUserRole(request.UserName);
                var token = GenerateJwtToken(request.UserName, type);
                var session = new Session(request.UserName, true, token.ToString(), type);

                return (session, "Succesfull.");
            }
            //Ha sikertelen
            else
            {
                return (null, "Incorrect password or username.");
            }
        }

        // Keresés felhasználónév alapján
        public async Task<List<UserDetailedDTO>> SearchByNameAsync(string name)
        {
            var users = await UserRepository.SearchByName(name);
            return users.ToDetailedDTO();
        }

        // Egy felhasználó hirdetéseinek listázása
        public IEnumerable<AdvertisementDetailedDTO> ListAdvertisementsByUser(string name)
        {
            var advertisements = AdvertisementRepository.ListByUser(name);
            return advertisements.ToDetailedDTO();
        }

        // Kijelentkezés
        public async Task SignOut()
        {
            await UserRepository.SignOut();
        }

        // Jelszó frissítése
        public Task UpdatePassword(string userName, string oldPassword, string newPassword)
        {
            return UserRepository.UpdatePassword(userName, oldPassword, newPassword);
        }

        // Felhasználó létrehozása
        public async Task<UserBasicDTO> Create(string userName, string email, string phone, string password)
        {
            //Megnézzük, hogy a név már foglalt-e
            var user = await UserRepository.GetByNameWithDetails(userName);

            //Ha igen...
            if (user != null) return null;

            //Ha nem...
            user = new ApplicationUser(userName, email, phone);
            var result = await UserRepository.Create(user, password);
            if (result.Succeeded)
            {
                //Létrehozunk neki egy mappát
                ImageRepository.CreateFolder(user.UserName);
            }
            return UserBasicDTO.ToDTO(user);
        }

        // Egy felhasználó előfizetésének lekérdezése
        public async Task<SubscriptionDTO> GetSubscriptionAsync(string userName)
        {
            var user = await UserRepository.GetByNameWithDetails(userName);
            var dto = user.Subscription.ToDTO();
            dto.User = UserBasicDTO.ToDTO(user);
            dto.RemainingNormalAdvertisementCount = user.Subscription.Model.NormalAdvertisementCount - AdvertisementRepository.ListByUser(userName, Priority.Normal).Count();
            dto.RemainingHighlightedAdvertisementCount = user.Subscription.Model.HighlightedAdvertisementCount - AdvertisementRepository.ListByUser(userName, Priority.Highlighted).Count();
            dto.RemainingFeaturedAdvertisementCount = user.Subscription.Model.FeaturedAdvertisementCount - AdvertisementRepository.ListByUser(userName, Priority.Featured).Count();
            return dto;
        }

        // Felhasználó törlése
        public async Task DeleteAsync(string name)
        {
            await UserRepository.Delete(name);
        }

        // Felhasználó engedélyezése
        public async Task<bool> Enable(string name)
        {
            return await UserRepository.Enable(name);
        }

        // Felhasználó letiltása
        public async Task Disable(string name)
        {
            var result = await UserRepository.Disable(name);
            if (result)
            {
                await AdvertisementRepository.HideAdvertisements(name);
            }

        }

        // A felhasználói szerepkör meghatározása
        public async Task<UserType> GetUserRole(string userName)
        {
            var role = await UserRepository.GetUserRole(userName);
            switch (role.Name)
            {
                case "User": return UserType.User;
                case "Administrator": return UserType.Administrator;
                default: throw new InvalidOperationException();
            }
        }

        // JWT Token generálása
        private object GenerateJwtToken(string name, UserType type)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, name),
                new Claim(JwtRegisteredClaimNames.Typ, type.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Secret Jwt Token Key Do Not Share With Anyone"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(30));
            var issuer = "AdvertisementApp";
            var audience = "AdvertisementAppUsers";

            var token = new JwtSecurityToken(issuer, audience, claims, null, expires, creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
