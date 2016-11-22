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
        
//        RegistryManager registryManager;
        public class FooMsg
        {
            public string deviceid { get; set; }
            public DateTime? endtimeofaveragewindow { get; set; }
            public double? avgtemp { get; set; }
            public double? triggertemp { get; set; }
            public DateTime? currenteventtime { get; set; }
            public double? previoustemp { get; set; }
            public DateTime? previoustime { get; set; }
            public string uid { get; set; }
            public string color { get; set; }
            public bool power { get; set; }
        }

        public class Light
        {
            public bool power { get; set; }
            public string color { get; set; }
        }

        public class Sound
        {
            public bool play { get; set; }
        }

        public class CloudToDeviceMessage
        {
            public string request { get; set; }
            public List<Light> lights { get; set; }
            public Sound sound { get; set; }
        }

        //        private async Task SendCloudToDeviceMessage()
        //        {
        //            var serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
        //
        //            var command = new CloudToDeviceMessage
        //            {
        //                request = "output",
        //                lights = new List<Light> { new Light { power = true, color = "red" } },
        //                sound = new Sound { play = false }
        //            };
        //            string messageString = JsonConvert.SerializeObject(command);
        //            
        //
        //            var commandMessage = new Message(Encoding.ASCII.GetBytes(messageString));
        //            await serviceClient.SendAsync("nathan-laptop", commandMessage).ConfigureAwait(false);
        //        }
        //
        //        private async Task AddTagsAndQuery()
        //        {
        //            var twin = await registryManager.GetTwinAsync("myDeviceId");
        //            var patch =@"{
        //                    tags: {
        //                        location: {
        //                            region: 'US',
        //                            plant: 'Redmond43'
        //                        }
        //                    }
        //                }";
        //            await registryManager.UpdateTwinAsync(twin.DeviceId, patch, twin.ETag);
        //
        //            var query = registryManager.CreateQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
        //            var twinsInRedmond43 = await query.GetNextAsTwinAsync();
        //            Console.WriteLine("Devices in Redmond43: {0}", string.Join(", ", twinsInRedmond43.Select(t => t.DeviceId)));
        //
        //            query = registryManager.CreateQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity.type = 'cellular'", 100);
        //            var twinsInRedmond43UsingCellular = await query.GetNextAsTwinAsync();
        //            Console.WriteLine("Devices in Redmond43 using cellular network: {0}", string.Join(", ", twinsInRedmond43UsingCellular.Select(t => t.DeviceId)));
        //        }

        
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
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Device))]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Get(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

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
        [Route("api/device")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Create(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            //create device in iot hub registry
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.AddDeviceAsync(new Device(id)).ConfigureAwait(false);

            var activation = await _activationService.Create(id);

//            //create an activation record in document db
//            var activation = new Activation()
//            {
//                id = id,
//                enabled = true,
//                code = Guid.NewGuid().ToString(),
//                HostName = iotHubHostName,
//                Key = device.Authentication.SymmetricKey.PrimaryKey
//            };
//
//            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
////            var database = await docDbClient.ReadDatabaseAsync(UriFactory.CreateDatabaseUri("manage"));
////            var collection = await docDbClient.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("manage", "activation"));
//            var document = await docDbClient.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri("manage", "activation"), activation).ConfigureAwait(false);

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

            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            await registryManager.RemoveDeviceAsync(id).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// disable a device
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
        [HttpPost]
        [Route("api/device/enabled")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Device))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public async Task<IHttpActionResult> Disable(string id, bool enabled, string reason = null)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.GetDeviceAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(device?.Id))
                return NotFound();

            device.Status = enabled? DeviceStatus.Enabled : DeviceStatus.Disabled;
            device.StatusReason = reason;
            await registryManager.UpdateDeviceAsync(device, true);

            return Ok(device);
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

            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var twin = await registryManager.GetTwinAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(twin?.DeviceId))
                return NotFound();

            return Ok(twin);
        }
        #endregion
    }
}
