using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Repositories;
using Microsoft.AspNetCore.Identity;
using System;

namespace AdvertisementApp.BusinessLogic.Services
{
    public class DataSeeder
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly RoleManager<IdentityRole> RoleManager;
        private readonly IFileRepository FileRepository;
        private readonly IAdvertisementRepository AdvertisementRepository;

        public DataSeeder(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IFileRepository fileRepository, IAdvertisementRepository advertisementRepository)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            FileRepository = fileRepository;
            AdvertisementRepository = advertisementRepository;
        }

        public void SeedData()
        {
            SeedRoles(RoleManager);
            SeedUsers(UserManager);
            // SeedAdvertisements(AdvertisementRepository);
        }

        //Ha nem léteznek a szerepek, akkor létrehozzuk
        private void SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync("User").Result)
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "User"
                };
                IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            }


            if (!roleManager.RoleExistsAsync("Administrator").Result)
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "Administrator"
                };
                IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            }
        }

        //Egy alap adminisztrátor létrehozása
        private void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            if (userManager.FindByNameAsync("admin").Result == null)
            {
                ApplicationUser user = new ApplicationUser
                {
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    PhoneNumber = "123456789",
                    Subscription = new Subscription { Model = new SubscriptionModel { Name = "Ultimate", DurationInDays = 30, Price = 500, NormalAdvertisementCount = 100, FeaturedAdvertisementCount = 100, HighlightedAdvertisementCount = 100 } }
                };

                user.LockoutEnabled = false;

                IdentityResult result = userManager.CreateAsync(user, "Admin123").Result;

                if (result.Succeeded)
                {
                    // Mappa létrehozása
                    FileRepository.CreateFolder(user.UserName);

                    // Admin szerep hozzárendelése
                    var addResult = userManager.AddToRoleAsync(user, "Administrator").Result;
                }
            }
        }

        //Néhány hirdetés hozzáadása, ha az adatbázis üres
        private void SeedAdvertisements(IAdvertisementRepository advertisementRepository)
        {
            var user = UserManager.FindByNameAsync("admin").Result;

            for (int i = 0; i < 50; i++)
            {
                var request = new Advertisement { Title = $"Hirdetes{i}", Description = "Valami leiras", Price = 100, Image = "house1.jpg", Status = Status.Displayed, UserName = "admin", User = user, UploadDate = DateTime.Now, CategoryId = 1 };
                request.Images.Add(new Image { File = "house1.jpg" });
                var result = advertisementRepository.CreateAsync(request).Result;
            }

            for (int i = 0; i < 50; i++)
            {
                var request = new Advertisement { Title = $"Fontos hirdetes{i}", Description = "Valami leiras", Price = 200, Image = "house3.jpg", Status = Status.Highlighted, UserName = "admin", User = user, UploadDate = DateTime.Now, CategoryId = 1 };
                request.Images.Add(new Image { File = "house1.jpg" });
                var result = advertisementRepository.CreateAsync(request).Result;
            }

            for (int i = 0; i < 50; i++)
            {
                var request = new Advertisement { Title = $"Kiemelt hirdetes{i}", Description = "Valami leiras a hirdetesrol", Price = 300, Image = "house2.jpg", Status = Status.Featured, Priority = Priority.Featured, UserName = "admin", User = user, UploadDate = DateTime.Now, CategoryId = 1 };
                request.Images.Add(new Image { File = "house2.jpg" });
                var result = advertisementRepository.CreateAsync(request).Result;
            }

        }
    }
}
