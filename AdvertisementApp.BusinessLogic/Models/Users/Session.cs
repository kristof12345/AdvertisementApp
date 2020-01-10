namespace AdvertisementApp.BusinessLogic.Models.Users
{
    public class Session
    {
        public Session(string userName, bool success, string token, UserType type)
        {
            Username = userName;
            Success = success;
            Token = token;
            UserType = type;
        }

        public string Username { get; set; }
        public bool Success { get; set; }
        public string Token { get; set; }
        public UserType UserType { get; set; }
    }
}