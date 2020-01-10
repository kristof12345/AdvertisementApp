using AdvertisementApp.BusinessLogic.Models.Advertisements;
using System;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class AdvertisementDetailedDTO : IAdvertisement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public Status Status { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }
        public Priority Priority { get; set; }
        public DateTime UploadDate { get; set; }
        public UserBasicDTO User { get; set; }
        public ICollection<DetailDTO> Details { get; set; } = new List<DetailDTO>();
        public IEnumerable<string> ImageList { get; set; } = new List<string>();
    }
}
