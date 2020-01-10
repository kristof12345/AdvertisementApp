namespace AdvertisementApp.BusinessLogic.Models.Advertisements
{
    public enum Status
    {
        Deleted,
        Disabled,
        Hidden,
        Displayed,
        Highlighted,
        Featured
    }

    public enum Priority
    {
        Normal,
        Highlighted,
        Featured
    }

    internal static class PriorityMethods
    {
        public static Status ToStatus(this Priority p)
        {
            switch (p)
            {
                case Priority.Featured:
                    return Status.Featured;
                case Priority.Highlighted:
                    return Status.Highlighted;
                default:
                    return Status.Displayed;
            }
        }
    }
}
