namespace AdvertisementApp.BusinessLogic.Models.Advertisements
{
    public class Detail
    {
        public int Id { get; set; }
        public string StringValue { get; set; }
        public int NumberValue { get; set; }

        //Külső kulcs
        public int MetaId { get; set; }
        public MetaDetail Meta { get; set; }
    }
}
