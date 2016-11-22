using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ActivationService.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;

namespace ActivationService.Controllers
{
    /// <summary>
    /// Device Activation
    /// </summary>
    [Produces("application/json")]
    [EnableCors("WideOpen")]
    public class DeviceController : Controller
    {
        private readonly string docDbUri;
        private readonly string docDbKey;

        private Uri ActivationDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri("manage", "activation");

        public DeviceController(IConfigurationRoot config)
        {
            docDbUri = config["docdb_uri"];
            docDbKey = config["docdb_key"];
        }

        /// <summary>
        /// Get device record using an activation code
        /// </summary>
        /// <param name="code">device activation code</param>
        /// <remarks>
        /// Id must be a valid GUID
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">Not Found</response>
        /// <response code="400">Invalid code</response>
        [HttpPost]
        [Route("api/[controller]/activate/{code}", Name = "ActivateDevice")]
        [ProducesResponseType(typeof(ActivationDto), 200)]
        public async Task<IActionResult> ActivateDevice(string code)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest();

            code = code.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var activation = docDbClient.CreateDocumentQuery<Activation>(ActivationDocumentCollectionUri)
                .Where(item => item.id == code).AsEnumerable().FirstOrDefault();

            if (null == activation)
                return NotFound();

            if (!activation.enabled)
                return Unauthorized();

            //mark this activation code as used
            activation.enabled = false;
            activation.reason = "used";
            var response = await docDbClient.UpsertDocumentAsync(ActivationDocumentCollectionUri, activation).ConfigureAwait(false);

            return new OkObjectResult(new ActivationDto
            {
                code = activation.id,
                deviceId = activation.deviceId,
                hostName = activation.hostName,
                key = activation.key
            });
        }
    }
}
