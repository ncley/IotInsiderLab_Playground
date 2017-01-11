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
    /// Administrator API for Activations
    /// </summary>
    public class ActivationController : ApiController
    {
        private readonly ActivationService _activationService;

        /// <summary>
        /// DI constructor
        /// </summary>
        /// <param name="activationService"></param>
        public ActivationController(ActivationService activationService)
        {
            _activationService = activationService;
        }

        /// <summary>
        /// Get activation record by id
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/activation/{id}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<Activation>))]
        public async Task<IHttpActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            id = id.ToLower();
            return Ok(await _activationService.GetActivationById(id).ConfigureAwait(false));
        }

        /// <summary>
        /// enable/disable an activation record
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="enabled">desired state of record</param>
        /// <param name="reason">reason for enabled state change</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="201">Created</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">Not Found</response>
        [HttpPut]
        [Route("api/activation/{id}/enabled")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public async Task<IHttpActionResult> Enabled(string id, bool enabled, string reason = null)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            id = id.ToLower();
            return Ok(await _activationService.SetEnabled(id, enabled, reason));
        }


        /// <summary>
        /// Get all activation records for a device
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/activation/device/{deviceid}")]
        [HttpGet]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<Activation>))]
        public async Task<IHttpActionResult> GetActivationsForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                return BadRequest();
            }

            deviceId = deviceId.ToLower();
            return Ok(await _activationService.GetAllActivationsForDevice(deviceId).ConfigureAwait(false));
        }

        /// <summary>
        /// Create a new activation for an existing device
        /// </summary>
        /// <param name="deviceId">Device Id</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="201">Created</response>
        /// <response code="400">Bad Request</response>
        [HttpPost]
        [Route("api/activation/device/{deviceId}")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> CreateActivationForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                return BadRequest();
            }

            deviceId = deviceId.ToLower();
            return Ok(await _activationService.Create(deviceId).ConfigureAwait(false));
        }

        /// <summary>
        /// Delete an activation record
        /// </summary>
        /// <param name="id">unique identifier for an activation record</param>
        /// <remarks>
        /// Id must be valid
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [HttpDelete]
        [Route("api/activation/{id}")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest();

            id = id.ToLower();
            await _activationService.Delete(id).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Delete all activation records for a device
        /// </summary>
        /// <param name="deviceId">unique identifier for a device</param>
        /// <remarks>
        /// Id must be valid
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [HttpDelete]
        [Route("api/activation/device/{deviceId}")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> DeleteAllActivationsForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
                return BadRequest();

            deviceId = deviceId.ToLower();
            await _activationService.DeleteAllActivationsForDevice(deviceId).ConfigureAwait(false);
            return Ok();
        }
    }
}
