namespace AdvertisementApp.BusinessLogic.Models.Advertisements
{
    public class Image
    {
        public int Id { get; set; }
        public string File { get; set; }

        //Külső kulcs
        public int AdvertisementId { get; set; }
        public virtual Advertisement Advertisement { get; set; }
    }
}
