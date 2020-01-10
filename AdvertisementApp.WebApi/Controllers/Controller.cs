using Microsoft.AspNetCore.Mvc;

namespace AdvertisementApp.WebApi.Controllers
{
    public class Controller : ControllerBase
    {
        protected string UserName
        {
            get
            {
                return User.FindFirst("sub")?.Value;
            }
        }

        protected string UserType
        {
            get
            {
                return User.FindFirst("typ")?.Value;
            }
        }

        protected string Admin
        {
            get
            {
                return "Administrator";
            }
        }
    }
}