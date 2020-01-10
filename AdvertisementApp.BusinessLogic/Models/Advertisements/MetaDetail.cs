namespace AdvertisementApp.BusinessLogic.Models.Advertisements
{
    public enum MetaType
    {
        Text,
        Number,
        Enumeration,
        Boolean
    }

    public enum Importance
    {
        Basic,
        Extra
    }

    public class MetaDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public MetaType Type { get; set; }
        public Importance Importance { get; set; }
        public string Domain { get; set; }
        public bool Required { get; set; }

        public string[] PossibleValues
        {
            get
            {
                if (Type != MetaType.Enumeration) return null;
                return Domain.Split(";");
            }
        }
    }
}