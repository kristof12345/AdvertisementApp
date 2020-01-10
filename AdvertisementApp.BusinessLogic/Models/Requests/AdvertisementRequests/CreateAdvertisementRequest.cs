using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.AdvertisementRequests
{
    public class CreateAdvertisementRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int CategoryId { get; set; }
        public string Image { get; set; }
        public Priority Priority { get; set; }
        public ICollection<DetailDTO> Details { get; set; } = new List<DetailDTO>();
        public IEnumerable<string> ImageList { get; set; } = new List<string>();
    }
}