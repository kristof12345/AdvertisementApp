using AdvertisementApp.BusinessLogic.Models;
using AdvertisementApp.BusinessLogic.Models.AdvertisementRequests;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : Controller
    {
        private readonly AdvertisementService AdvertisementService = null;
        private readonly SubscriptionService SubscriptionService = null;

        public AdvertisementsController(AdvertisementService advertisementService, SubscriptionService subscriptionService)
        {
            AdvertisementService = advertisementService;
            SubscriptionService = subscriptionService;
        }

        // GET: api/Advertisements/categories
        [HttpGet("categories")]
        public IEnumerable<Category> GetCategories()
        {
            return AdvertisementService.GetCategories();
        }

        // GET: api/Advertisements
        [HttpGet]
        public IEnumerable<AdvertisementBasicDTO> GetAdvertisements([FromQuery] Range range)
        {
            return AdvertisementService.GetRange(range);
        }

        // GET: api/Advertisements/Featured
        [HttpGet("featured")]
        public IEnumerable<AdvertisementBasicDTO> GetFeaturedAdvertisements([FromQuery] Range range)
        {
            return AdvertisementService.GetFeatured(range);
        }

        // GET: api/Advertisements/Disabled
        [Authorize]
        [HttpGet("disabled")]
        public ActionResult<IEnumerable<AdvertisementBasicDTO>> GetDisabledAdvertisements([FromQuery] Range range)
        {
            if (UserType != Admin)
                return Unauthorized();

            return Ok(AdvertisementService.GetDisabled(range));
        }

        // POST: api/Advertisements/Search
        [HttpPost("search")]
        public IEnumerable<AdvertisementBasicDTO> SearchAdvertisements([FromQuery] Range range, [FromBody] SearchAdvertisementsRequest request)
        {
            return AdvertisementService.Search(range, request);
        }

        // POST: api/Advertisements/Search-status/
        [HttpPost("search-by-status")]
        public ActionResult<IEnumerable<AdvertisementBasicDTO>> SearchAdvertisements([FromQuery] Range range, [FromQuery] Status status, [FromBody] SearchAdvertisementsRequest request)
        {
            if (UserType != Admin)
                return Unauthorized();

            return Ok(AdvertisementService.SearchByStatus(range, request, status));
        }

        // GET: api/Advertisements/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAdvertisementDetails([FromRoute] int id)
        {
            var advertisement = await AdvertisementService.GetAdvertisement(id);

            if (advertisement == null)
                return NotFound();

            return Ok(advertisement);
        }

        // POST: api/Advertisements
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAdvertisement(CreateAdvertisementRequest request)
        {
            var advertisement = await AdvertisementService.CreateAdvertisement(UserName, request);

            if (advertisement == null)
                return BadRequest("Your subscription doesn't allow this.");

            return CreatedAtAction(nameof(GetAdvertisementDetails), new { id = advertisement.Id }, advertisement);
        }

        // PUT: api/Advertisements/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdvertisement([FromRoute] int id, [FromBody] UpdateAdvertisementRequest request)
        {
            var advertisement = await AdvertisementService.UpdateAdvertisement(UserName, id, request);

            if (advertisement == null)
                return NotFound();

            return Ok(advertisement);
        }

        // DELETE: api/Advertisements/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdvertisement([FromRoute] int id)
        {
            var advertisement = await AdvertisementService.DeleteAdvertisement(UserName, id);

            if (advertisement == null)
                return NotFound();

            return Ok(advertisement);
        }

        // PATCH: api/Advertisements/1/enable
        [Authorize]
        [HttpPatch("{id}/enable")]
        public async Task<IActionResult> EnableAdvertisement([FromRoute] int id)
        {
            if (UserType != Admin)
                return Unauthorized();

            var advertisement = await AdvertisementService.Enable(id);
            await SubscriptionService.UpdateUserSubscription(advertisement.UserName);
            return Ok();
        }

        // PATCH: api/Advertisements/1/disable
        [Authorize]
        [HttpPatch("{id}/disable")]
        public async Task<IActionResult> DisableAdvertisement([FromRoute] int id)
        {
            if (UserType != Admin)
                return Unauthorized();

            await AdvertisementService.Disable(id);
            return Ok();
        }
    }
}