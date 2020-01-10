using AdvertisementApp.BusinessLogic.Models.Advertisements;

namespace AdvertisementApp.BusinessLogic.Models.DataTransferObjects
{
    public class DetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string StringValue { get; set; }
        public int NumberValue { get; set; }
        public MetaType Type { get; set; }
        public Importance Importance { get; set; }
        public bool Required { get; set; }
        public string[] PossibleValues { get; set; }
        public int MetaId { get; set; }
    }
}
