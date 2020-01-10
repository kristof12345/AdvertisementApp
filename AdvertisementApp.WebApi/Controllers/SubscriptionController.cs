using AdvertisementApp.BusinessLogic.Models.Subscriptions;
using AdvertisementApp.BusinessLogic.Models.UserRequests;
using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : Controller
    {
        private readonly SubscriptionService SubscriptionService = null;

        public SubscriptionController(SubscriptionService subscriptionService)
        {
            SubscriptionService = subscriptionService;
        }

        // GET: api/Subscription
        [HttpGet]
        public IEnumerable<SubscriptionModel> GetSubscriptionModels()
        {
            return SubscriptionService.GetModels();
        }

        // GET: api/Subscription/bob
        [Authorize]
        [HttpGet("{user}")]
        public async Task<IActionResult> GetSubscriptionForUser([FromRoute] string user)
        {
            if (UserName != user)
                return Unauthorized();

            var subscription = await SubscriptionService.GetSubscriptionForUser(user);
            return Ok(subscription);
        }

        // POST: api/Subscription
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Subscribe([FromBody] SubscriptionRequest request)
        {
            await SubscriptionService.Subscribe(UserName, request.Subscription);
            return Ok();
        }

        // DELETE: api/Subscription
        [Authorize]
        [HttpDelete]
        public async Task Unsubscribe([FromBody] SubscriptionRequest request)
        {
            await SubscriptionService.Unsubscribe(UserName, request.Subscription);
        }
    }
}
