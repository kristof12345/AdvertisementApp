using AdvertisementApp.BusinessLogic.Converters;
using AdvertisementApp.BusinessLogic.Models.Advertisements;
using AdvertisementApp.BusinessLogic.Models.DataTransferObjects;
using AdvertisementApp.BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AdvertisementApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetaDetailsController : Controller
    {
        private readonly MetaDetailService MetaDetailService = null;

        public MetaDetailsController(MetaDetailService metaDetailService)
        {
            MetaDetailService = metaDetailService;
        }

        // GET: api/MetaDetails
        [HttpGet]
        public IEnumerable<DetailDTO> GetMetaDetails()
        {
            var list = MetaDetailService.GetAll();
            var dtoList = new List<DetailDTO>();
            foreach (MetaDetail meta in list) { dtoList.Add(meta.ToDTO()); }
            return dtoList;
        }

        // GET: api/MetaDetails/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomMetaDetail([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customMetaDetail = await MetaDetailService.Find(id);

            if (customMetaDetail == null)
            {
                return NotFound();
            }

            return Ok(customMetaDetail);
        }
    }
}