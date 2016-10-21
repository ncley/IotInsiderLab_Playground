using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ArgonneDashboard.ArgonneServiceClient;
using ArgonneDashboard.ArgonneServiceClient.Models;
using ArgonneDashboard.Models;
using Microsoft.AspNetCore.Mvc;

namespace ArgonneDashboard.Controllers
{
    /// <summary>
    /// Administrator API for Campaigns
    /// </summary>
    [Produces("application/json")]
    public class DataController : Controller
    {
        private string ServiceUri = Startup.ServiceUri;

        #region Campaign
        /// <summary>
        /// Get the highest scoring (average) emotion for a campaign during an interval of time
        /// </summary>
        /// <param name="campaignid">unique identifier for a campaign</param>
        /// <param name="start">timestamp for start of series</param>
        /// <param name="end">timestamp for end of series</param>
        /// <remarks>
        /// Id must be a valid GUID
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">Not Found</response>
        /// <response code="400">Invalid Id</response>
        [Route("api/[controller]/campaign/{campaignid}/impressions/aggregate", Name = "GetAggregateImpressionsForCampaign")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AdAggregateData>), 200)]
        public async Task<IActionResult> GetAggregateImpressionsForCampaign(string campaignid,
            [FromQuery]DateTime? start = null,
            [FromQuery]DateTime? end = null)
        {
            using (ArgonneAPI client = new ArgonneAPI(new Uri(ServiceUri)))
            {
                return new OkObjectResult(await client.ApiAdminCampaignByCampaignidImpressionsAggregateGetAsync(campaignid, start: start, end: end).ConfigureAwait(false));
            }
        }

        #endregion
    }
}
