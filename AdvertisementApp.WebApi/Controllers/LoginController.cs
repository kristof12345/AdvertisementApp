using AdvertisementApp.BusinessLogic.Models.UserRequests;
using AdvertisementApp.BusinessLogic.Models.Users;
using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly UserService UserService = null;

        public LoginController(UserService userService)
        {
            UserService = userService;
        }

        // POST: api/Login
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            (Session session, string message) = await UserService.Login(request);
            if (session != null)
                return Ok(session);
            else
                return BadRequest(message);

        }
    }
}