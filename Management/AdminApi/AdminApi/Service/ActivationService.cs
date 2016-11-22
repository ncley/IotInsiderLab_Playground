using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AdminApi.Models;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;
using Microsoft.Azure.Documents.Client;

namespace AdminApi.Service
{
    public class ActivationService
    {
        readonly string iotHubConnectionString = ConfigurationManager.AppSettings["iothub_connection"];
        readonly string iotHubHostName = ConfigurationManager.AppSettings["iothub_hostname"];
        readonly string docDbUri = ConfigurationManager.AppSettings["docdb_uri"];
        readonly string docDbKey = ConfigurationManager.AppSettings["docdb_key"];

        public async Task<Activation> Create(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new InvalidOperationException("invalid id");
            }

            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.GetDeviceAsync(id).ConfigureAwait(false);
            if (string.IsNullOrEmpty(device?.Id))
                throw new DeviceNotFoundException(id);

            //create an activation record in document db
            var activation = new Activation()
            {
                id = id,
                enabled = true,
                code = Guid.NewGuid().ToString(),
                HostName = iotHubHostName,
                Key = device.Authentication.SymmetricKey.PrimaryKey
            };

            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var document = await docDbClient.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri("manage", "activation"), activation).ConfigureAwait(false);

            return activation;
        }
    }
}