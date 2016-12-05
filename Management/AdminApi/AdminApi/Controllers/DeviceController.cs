using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using AdminApi.Models;
using AdminApi.Service;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Swashbuckle.Swagger.Annotations;

namespace AdminApi.Controllers
{
    /// <summary>
    /// Administrator API for Campaigns
    /// </summary>
    public class DeviceController : ApiController
    {
        private readonly ActivationService _activationService;
        readonly string iotHubConnectionString = ConfigurationManager.AppSettings["iothub_connection"];
        
        /// <summary>
        /// DI Constructor
        /// </summary>
        /// <param name="activationService"></param>
        public DeviceController(ActivationService activationService)
        {
            _activationService = activationService;
        }

        #region device
        /// <summary>
        /// Get all Devices
        /// </summary>
        /// <response code="200">Success</response>
        [Route("api/device")]
        [HttpGet]
        [SwaggerOperation("GetAllDevices")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(IEnumerable<Device>))]
        public async Task<IHttpActionResult> Get()
        {
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            return Ok(await registryManager.GetDevicesAsync(1000).ConfigureAwait(false));
        }

        /// <summary>
        /// Get Device
        /// </summary>
        /// <param name="id">Device Id</param>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">Not Found</response>
        [Route("api/device/{id}", Name = "GetDeviceByID")]
        [HttpGet]
        [SwaggerOperation("GetDeviceById")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Device))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            id = id.ToLower();
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.GetDeviceAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(device?.Id))
                return NotFound();

            return Ok(device);
        }

        /// <summary>
        /// Create a new device
        /// </summary>
        /// <param name="id">Device Id</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="201">Created</response>
        /// <response code="400">Bad Request</response>
        [HttpPost]
        [Route("api/device/{id}")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Create(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            id = id.ToLower();
            //create device in iot hub registry
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.AddDeviceAsync(new Device(id)).ConfigureAwait(false);
            var activation = await _activationService.Create(device);
            return CreatedAtRoute("GetDeviceById", new { id }, activation);
        }

        /// <summary>
        /// Delete an existing Device
        /// </summary>
        /// <param name="id">unique identifier for a device</param>
        /// <remarks>
        /// Id must be valid
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        [HttpDelete]
        [Route("api/device/{id}")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest();

            id = id.ToLower();
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            await registryManager.RemoveDeviceAsync(id).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// enable/disable a device's ability to connect to IotHub
        /// </summary>
        /// <param name="id">Device Id</param>
        /// <param name="enabled">desired state of device</param>
        /// <param name="reason">reason for enabled state change</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="201">Created</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">Not Found</response>
        [HttpPut]
        [Route("api/device/{id}/enabled")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Device))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public async Task<IHttpActionResult> Enabled(string id, bool enabled, string reason = null)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            id = id.ToLower();
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.GetDeviceAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(device?.Id))
                return NotFound();

            device.Status = enabled? DeviceStatus.Enabled : DeviceStatus.Disabled;
            device.StatusReason = reason;
            await registryManager.UpdateDeviceAsync(device, true);

            return Ok(device);
        }

        /// <summary>
        /// Send a message to a device
        /// </summary>
        /// <param name="id">Device Id</param>
        /// <param name="messageBody">message to send</param>
        /// <remarks>
        /// Id field is required
        /// </remarks>
        /// <response code="201">Created</response>
        /// <response code="400">Bad Request</response>
        [HttpPost]
        [Route("api/device/{id}/send")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> SendMessageToDevice(string id, [FromBody]string messageBody)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            id = id.ToLower();
            var serviceClient = ServiceClient.CreateFromConnectionString(iotHubConnectionString);
            var commandMessage = new Message(Encoding.ASCII.GetBytes(messageBody));
            await serviceClient.SendAsync(id, commandMessage);

            return Ok();
        }

        #endregion
        #region twin
        /// <summary>
        /// Get Device Twin
        /// </summary>
        /// <param name="id">Device Id</param>
        /// <response code="200">Success</response>
        /// <response code="400">Bad Request</response>
        /// <response code="404">Not Found</response>
        [Route("api/device/{id}/twin", Name = "GetDeviceTwinByID")]
        [HttpGet]
        [SwaggerOperation("GetDeviceTwinByID")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Twin))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> GetTwin(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            id = id.ToLower();
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var twin = await registryManager.GetTwinAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(twin?.DeviceId))
                return NotFound();

            return Ok(twin);
        }
        #endregion
    }
}
