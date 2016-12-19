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
using Microsoft.Azure.Documents.Linq;

namespace AdminApi.Service
{
    /// <summary>
    /// Handles activation records
    /// </summary>
    public class ActivationService
    {
        readonly string iotHubConnectionString = ConfigurationManager.AppSettings["iothub_connection"];
        readonly string iotHubHostName = ConfigurationManager.AppSettings["iothub_hostname"];
        readonly string docDbUri = ConfigurationManager.AppSettings["docdb_uri"];
        readonly string docDbKey = ConfigurationManager.AppSettings["docdb_key"];

        private const string databaseId = @"manage";
        private const string documentCollectionId = @"activation";
        private Uri ActivationDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri(databaseId, documentCollectionId);


        private static async Task<IEnumerable<T>> QueryAsync<T>(IQueryable<T> query)
        {
            var docQuery = query.AsDocumentQuery();
            var batches = new List<IEnumerable<T>>();
            do
            {
                var batch = await docQuery.ExecuteNextAsync<T>();
                batches.Add(batch);
            }
            while (docQuery.HasMoreResults);
            var docs = batches.SelectMany(b => b);
            return docs;
        }

        /// <summary>
        /// Create a new activation record for a device
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<Activation> Create(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            deviceId = deviceId.ToLower();
            var registryManager = RegistryManager.CreateFromConnectionString(iotHubConnectionString);
            var device = await registryManager.GetDeviceAsync(deviceId).ConfigureAwait(false);
            if (string.IsNullOrEmpty(device?.Id))
                throw new DeviceNotFoundException(deviceId);

            return await Create(device);
        }

        /// <summary>
        /// Create a new activation record for a device
        /// </summary>
        /// <param name="device"></param>
        /// <returns></returns>
        public async Task<Activation> Create(Device device)
        {
            if (null == device)
            {
                throw new InvalidOperationException("invalid device");
            }

            //create an activation record in document db
            var activation = new Activation()
            {
                id = Guid.NewGuid().ToString(),
                deviceId = device.Id.ToLower(),
                enabled = true,
                hostName = iotHubHostName,
                key = device.Authentication.SymmetricKey.PrimaryKey,
                createdDate = DateTime.UtcNow
            };

            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var document = await docDbClient.CreateDocumentAsync(ActivationDocumentCollectionUri, activation).ConfigureAwait(false);

            return activation;
        }

        /// <summary>
        /// get all activation records for a device
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Activation>> GetAllActivationsForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            deviceId = deviceId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var activations = await QueryAsync(docDbClient.CreateDocumentQuery<Activation>(ActivationDocumentCollectionUri)
                .Where(item => item.deviceId == deviceId)).ConfigureAwait(false);

            return activations;
        }

        /// <summary>
        /// get specific activation record
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Activation> GetActivationById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new InvalidOperationException("invalid id");
            }

            id = id.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var activation = await QueryAsync(docDbClient.CreateDocumentQuery<Activation>(ActivationDocumentCollectionUri)
                .Where(item => item.id == id)).ConfigureAwait(false);
            return activation.FirstOrDefault();
        }

        /// <summary>
        /// set enabled state
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Activation> SetEnabled(string id, bool enabled, string reason = null)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new InvalidOperationException("invalid id");
            }

            id = id.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var activation = (await QueryAsync(docDbClient.CreateDocumentQuery<Activation>(ActivationDocumentCollectionUri)
                .Where(item => item.id == id)).ConfigureAwait(false)).FirstOrDefault();

            if(null == activation)
                throw new InvalidOperationException("activation record not found");

            activation.enabled = enabled;
            activation.reason = reason;
            if (!activation.enabled)
            {
                activation.activatedDate = DateTime.UtcNow;
            }
            else
            {
                activation.activatedDate = null;
            }

            var response = await docDbClient.UpsertDocumentAsync(ActivationDocumentCollectionUri, activation).ConfigureAwait(false);
            return activation;
        }

        /// <summary>
        /// delete an activation record
        /// </summary>
        /// <param name="activationId"></param>
        /// <returns></returns>
        public async Task Delete(string activationId)
        {
            if (string.IsNullOrEmpty(activationId))
            {
                throw new InvalidOperationException("invalid id");
            }

            activationId = activationId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var response = await docDbClient.DeleteDocumentAsync(UriFactory.CreateDocumentUri(databaseId, documentCollectionId, activationId)).ConfigureAwait(false);
        }

        /// <summary>
        /// delete all activation records for a device
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task DeleteAllActivationsForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            deviceId = deviceId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var activations = (await QueryAsync(docDbClient.CreateDocumentQuery<Activation>(ActivationDocumentCollectionUri)
                .Where(item => item.deviceId == deviceId)).ConfigureAwait(false));
            foreach (var activation in activations)
            {
                var response = await docDbClient.DeleteDocumentAsync(UriFactory.CreateDocumentUri(databaseId, documentCollectionId, activation.id)).ConfigureAwait(false);
            }
    

            //var response = await docDbClient.DeleteDocumentAsync(UriFactory.CreateDocumentUri(databaseId, documentCollectionId, activationId)).ConfigureAwait(false);
        }
    }
}