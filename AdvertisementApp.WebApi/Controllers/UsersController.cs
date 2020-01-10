using AdvertisementApp.BusinessLogic.Models.UserRequests;
using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly UserService UserService = null;
        private readonly SubscriptionService SubscriptionService = null;

        public UsersController(UserService userService, SubscriptionService subscriptionService)
        {
            UserService = userService;
            SubscriptionService = subscriptionService;
        }

        // SEARCH: api/Users/bob
        [Authorize]
        [HttpGet("{name}")]
        public async Task<IActionResult> SearchUsers([FromRoute] string name)
        {
            if (UserType != Admin)
                return Unauthorized();

            var user = await UserService.SearchByNameAsync(name);
            return Ok(user);
        }

        // GET: api/Users/bob/details
        [Authorize]
        [HttpGet("{name}/details")]
        public async Task<IActionResult> GetUserDetails([FromRoute] string name)
        {
            //Ha a név nem stimmel, akkor hibát adunk vissza.
            if (name != UserName)
                return Unauthorized();

            var subscription = await UserService.GetSubscriptionAsync(name);

            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        // GET: api/Users/bob/Advertisements
        [Authorize]
        [HttpGet("{name}/advertisements")]
        public IActionResult GetAdvertisementsByUser([FromRoute] string name)
        {
            //Ha a név nem stimmel, akkor hibát adunk vissza.
            if (name != UserName)
                return Unauthorized();

            var advertisements = UserService.ListAdvertisementsByUser(name);
            return Ok(advertisements);
        }

        // PUT: api/Users/bob/password
        [Authorize]
        [HttpPut("{name}/password")]
        public async Task<IActionResult> ChangePassword([FromRoute] string name, [FromBody] PasswordChangeRequest request)
        {
            //Ha a név nem stimmel, akkor hibát adunk vissza.
            if (name != UserName)
                return Unauthorized();

            //Frissítjük a jelszót
            await UserService.UpdatePassword(name, request.OldPassword, request.NewPassword);
            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] RegisterRequest request)
        {
            var user = await UserService.Create(request.UserName, request.Email, request.Phone, request.Password);
            if (user == null) return BadRequest("Username already taken.");
            return Ok(user);
        }

        // DELETE: api/Users/bob
        [Authorize]
        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string name)
        {
            //Ha a név nem stimmel, akkor hibát adunk vissza.
            if (name != UserName)
                return Unauthorized();

            //Felhasználó törlése.
            await UserService.DeleteAsync(name);
            return Ok();
        }

        // PATCH: api/Users/bob/enable
        [Authorize]
        [HttpPatch("{name}/enable")]
        public async Task<IActionResult> EnableUser([FromRoute] string name)
        {
            if (UserType != Admin)
                return Unauthorized();

            var result = await UserService.Enable(name);
            if (result) { await SubscriptionService.UpdateUserSubscription(name); }
            return Ok();
        }

        // PATCH: api/Users/bob/disable
        [Authorize]
        [HttpPatch("{name}/disable")]
        public async Task<IActionResult> DisableUser([FromRoute] string name)
        {
            if (UserType != Admin)
                return Unauthorized();

            await UserService.Disable(name);
            return Ok();
        }
    }
}