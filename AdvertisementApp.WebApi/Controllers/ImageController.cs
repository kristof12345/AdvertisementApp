using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : Controller
    {
        private readonly ImageService ImageService = null;

        public ImageController(ImageService imageService)
        {
            ImageService = imageService;
        }

        [HttpGet("{userName}/{fileName}")]
        public IActionResult GetImage([FromRoute] string userName, [FromRoute] string fileName)
        {
            var result = ImageService.Load(fileName, userName);
            if (result == null)
                return NotFound();
            return result;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SaveImage(IFormFile file)
        {
            var fileName = await ImageService.Save(file, UserName);
            return Ok(fileName);
        }

        [Authorize]
        [HttpDelete("{fileName}")]
        public IActionResult DeleteImage([FromRoute] string fileName)
        {
            ImageService.Delete(fileName, UserName);
            return Ok();
        }
    }
}