using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using AdminApi.Models;
using AdminApi.Service;
using Swashbuckle.Swagger.Annotations;


namespace AdminApi.Controllers
{
    /// <summary>
    /// Administrator API for Device Messaging Stats
    /// </summary>
    public class StatsController : ApiController
    {
        private readonly StatsService _statsService;

        /// <summary>
        /// DI constructor
        /// </summary>
        /// <param name="statsService"></param>
        public StatsController(StatsService statsService)
        {
            _statsService = statsService;
        }

        /// <summary>
        /// Get device record by id
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/devicestate/{deviceid}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(DeviceState))]
        public async Task<IHttpActionResult> GetDeviceRecord(string deviceid)
        {
            if (string.IsNullOrEmpty(deviceid))
            {
                return BadRequest();
            }

            deviceid = deviceid.ToLower();
            return Ok(await _statsService.GetDeviceRecord(deviceid).ConfigureAwait(false));
        }

        /// <summary>
        /// Get stats records for device
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/device/{deviceid}/{windowsize?}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<DeviceStats>))]
        public async Task<IHttpActionResult> GetLatestStatsForDevice(string deviceid, string windowsize = "day", int? limit = 1000)
        {
            if (string.IsNullOrEmpty(deviceid))
            {
                return BadRequest();
            }

            deviceid = deviceid.ToLower();
            return Ok(await _statsService.GetLatestStatsForDevice(deviceid, windowsize, limit).ConfigureAwait(false));
        }

        /// <summary>
        /// Get alert records for device
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/alerts/device/{deviceid}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<DeviceAlert>))]
        public async Task<IHttpActionResult> GetAlertsForDevice(string deviceid)
        {
            if (string.IsNullOrEmpty(deviceid))
            {
                return BadRequest();
            }

            deviceid = deviceid.ToLower();
            return Ok(await _statsService.GetActiveAlertsForDevice(deviceid).ConfigureAwait(false));
        }

        /// <summary>
        /// Delete all alert records for a device
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/alerts/device/{deviceid}")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK)]
        public async Task<IHttpActionResult> DeleteAllAlertsForDevice(string deviceId)
        {
            await _statsService.DeleteAllAlertsForDevice(deviceId).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Delete all alert records
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/alerts")]
        [HttpDelete]
        [SwaggerResponse(HttpStatusCode.OK)]
        public async Task<IHttpActionResult> DeleteAllAlerts()
        {
            await _statsService.DeleteAllAlerts().ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get alert records
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/alerts")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<DeviceAlert>))]
        public async Task<IHttpActionResult> GetAlerts(int? limit = 1000)
        {
            return Ok(await _statsService.GetActiveAlerts(limit).ConfigureAwait(false));
        }

        /// <summary>
        /// Get aggregate records
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/stats/aggregate/{windowsize}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<AggregateStats>))]
        public async Task<IHttpActionResult> GetLatestAggregateRecords(string windowsize = "day", int? limit = 1000)
        {
            windowsize = windowsize.ToLower();
            return Ok(await _statsService.GetLatestAggregateRecords(windowsize, limit).ConfigureAwait(false));
        }

        /// <summary>
        /// acknowledge alert record
        /// </summary>
        /// <param name="id">Id</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [HttpPut]
        [Route("api/stats/alerts/acknowledge")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> AcknowledgeAlert([FromBody]string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            id = id.ToLower();
            return Ok(await _statsService.AcknowledgeAlert(id));
        }
    }
}
