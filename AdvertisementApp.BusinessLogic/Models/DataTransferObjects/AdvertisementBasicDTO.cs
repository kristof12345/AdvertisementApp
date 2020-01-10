using AdvertisementApp.BusinessLogic.Models.Advertisements;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class AdvertisementBasicDTO : IAdvertisement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }
        public Status Status { get; set; }
    }
}