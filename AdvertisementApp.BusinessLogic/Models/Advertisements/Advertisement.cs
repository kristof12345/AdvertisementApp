using AdvertisementApp.BusinessLogic.Models.Users;
using System;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.Advertisements
{
    public interface IAdvertisement
    {
        int Id { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        int Price { get; set; }
        string Image { get; set; }
        Status Status { get; set; }
    }

    public class Advertisement : IAdvertisement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public Status Status { get; set; }
        public Priority Priority { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }
        public DateTime UploadDate { get; set; }

        public virtual ApplicationUser User { get; set; }
        public virtual ICollection<Detail> Details { get; set; } = new List<Detail>();
        public virtual ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
