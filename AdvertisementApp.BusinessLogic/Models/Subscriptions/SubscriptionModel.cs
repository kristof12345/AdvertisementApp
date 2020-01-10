namespace AdvertisementApp.BusinessLogic.Models.Subscriptions
{
    public class SubscriptionModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int DurationInDays { get; set; }
        public bool MultipleImageUpload { get; set; } = true;
        public int NormalAdvertisementCount { get; set; }
        public int FeaturedAdvertisementCount { get; set; }
        public int HighlightedAdvertisementCount { get; set; }
    }
}
