using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.Users
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser() { }

        public ApplicationUser(string name, string email, string phone)
        {
            UserName = name;
            Email = email;
            PhoneNumber = phone;
        }

        public DateTime RegistrationDate { get; set; }

        public bool Enabled { get; set; } = true;

        public virtual Subscription Subscription { get; set; }

        public virtual ICollection<Advertisement> Advertisements { get; set; } = new List<Advertisement>();
    }
}
