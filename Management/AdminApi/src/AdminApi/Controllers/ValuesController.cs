using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace AdminApi.Controllers
{
    
    /// <summary>
    /// Administrator API for Campaigns
    /// </summary>
    [Produces("application/json")]
    [EnableCors("WideOpenCORSPolicy")]
    public class ValuesController : Controller
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        /// <summary>
        /// Get all Foos
        /// </summary>
        /// <param name="pager">paging settings</param>
        /// <response code="200">Success</response>
        [Route("api/[controller]")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public async Task<IActionResult> GetAll()//[FromQuery]PagerDto pager)
        {
            return new OkObjectResult(new List<string> {"hi","world"});
        }
    }
}
