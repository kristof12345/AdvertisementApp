using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {

        private readonly IConfiguration Configuration = null;

        public SettingsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // GET: api/settings
        [HttpGet]
        public IActionResult GetMainTitle()
        {
            var title = Configuration.GetValue<string>("Title");
            var subtitle = Configuration.GetValue<string>("Subtitle");
            return Ok(new { title, subtitle });
        }
    }
}