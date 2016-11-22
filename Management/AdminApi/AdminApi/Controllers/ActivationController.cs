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
    public class ActivationController : ApiController
    {
        private readonly ActivationService _activationService;

        public ActivationController(ActivationService activationService)
        {
            _activationService = activationService;
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
        [Route("api/activation")]
        [SwaggerResponse(HttpStatusCode.OK, Type = typeof(Activation))]
        [SwaggerResponse(HttpStatusCode.BadRequest)]
        public async Task<IHttpActionResult> Create(string deviceId)
        {
            return Ok(await _activationService.Create(deviceId));
        }

    }
}
