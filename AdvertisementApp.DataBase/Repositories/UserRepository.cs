using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Repositories;
using AdvertisementApp.DataBase.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvertisementApp.DataBase.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> UserManager = null;
        private readonly SignInManager<ApplicationUser> SignInManager = null;
        private readonly DatabaseContext Context;

        public UserRepository(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            DatabaseContext context)
        {
            Context = context;
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public async Task<IdentityResult> Create(ApplicationUser user, string password)
        {
            //Hozzárendelünk egy alap előfizetést
            var defaultSubscription = 1;
            var duration = Context.SubscriptionModels.Find(defaultSubscription).DurationInDays;
            user.Subscription = new Subscription { ModelId = defaultSubscription, ExpiryDate = DateTime.Today.AddDays(duration) };
            user.LockoutEnabled = false;

            //Hozzáadjuk a felhasználókhoz
            var result = await UserManager.CreateAsync(user, password);

            //Ha sikeres a felhasználó létrehozása...
            if (result.Succeeded)
            {
                //Akkor beállítjuk a típusát
                await UserManager.AddToRoleAsync(user, "User");

            }
            await Context.SaveChangesAsync();
            return result;
        }

        public async Task<IdentityResult> Delete(string name)
        {
            var user = await UserManager.FindByNameAsync(name);
            var result = await UserManager.DeleteAsync(user);
            return result;
        }

        public async Task<IdentityResult> UpdatePassword(string name, string oldPassword, string newPassword)
        {
            var user = await UserManager.FindByNameAsync(name);
            return await UserManager.ChangePasswordAsync(user, oldPassword, newPassword);
        }

        public async Task<ApplicationUser> GetByName(string name)
        {
            var user = await Context.Users.Include(u => u.Subscription).ThenInclude(s => s.Model).FirstAsync(u => u.UserName == name);
            return user;
        }

        public async Task<ApplicationUser> GetByNameWithDetails(string name)
        {
            var user = await Context.Users.Include(u => u.Advertisements).Include(u => u.Subscription).ThenInclude(s => s.Model).FirstOrDefaultAsync(u => u.UserName == name);
            return user;
        }

        public async Task<IdentityRole> GetUserRole(string name)
        {
            var user = await Context.Users.FirstOrDefaultAsync(u => u.UserName == name);
            var userRole = await Context.UserRoles.FirstOrDefaultAsync(r => r.UserId == user.Id);
            var role = await Context.Roles.FindAsync(userRole.RoleId);
            return role;
        }

        public async Task<List<ApplicationUser>> SearchByName(string name)
        {
            var users = Context.Users.Include(u => u.Subscription).ThenInclude(s => s.Model).Where(u => u.UserName.Contains(name));
            return await users.ToListAsync();
        }

        public async Task<SignInResult> SignIn(string name, string password)
        {
            var user = await UserManager.FindByNameAsync(name);
            //Ha nincs ilyen felhasználó vagy le van tiltva
            if (user == null || !user.Enabled)
                return SignInResult.Failed;
            return await SignInManager.CheckPasswordSignInAsync(user, password, false);
        }

        public Task SignOut()
        {
            return SignInManager.SignOutAsync();
        }

        public async Task<bool> Enable(string name)
        {
            var user = await UserManager.FindByNameAsync(name);
            if (user != null)
            {
                user.Enabled = true;
                Context.Update(user);
                await Context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> Disable(string name)
        {
            var user = await UserManager.FindByNameAsync(name);
            if (user != null)
            {
                user.Enabled = false;
                Context.Update(user);
                await Context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
