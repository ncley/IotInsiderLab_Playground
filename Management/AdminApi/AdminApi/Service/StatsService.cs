using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AdminApi.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace AdminApi.Service
{
    /// <summary>
    /// Handles stats data
    /// </summary>
    public class StatsService
    {
        readonly string docDbUri = ConfigurationManager.AppSettings["docdb_uri"];
        readonly string docDbKey = ConfigurationManager.AppSettings["docdb_key"];

        private const string databaseId = @"manage";
        private const string deviceDocumentCollectionId = @"device";
        private const string alertDocumentCollectionId = @"logicalert";
        private const string allStatsDocumentCollectionId = @"devicetocloudstats";
        private const string deviceStatsDocumentCollectionId = @"devicemessagecounts";

        private Uri DeviceDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri(databaseId, deviceDocumentCollectionId);
        private Uri AllStatsDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri(databaseId, allStatsDocumentCollectionId);
        private Uri DeviceStatsDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri(databaseId, deviceStatsDocumentCollectionId);
        private Uri AlertDocumentCollectionUri => UriFactory.CreateDocumentCollectionUri(databaseId, alertDocumentCollectionId);

        //	-mark an alarm as acknowledged

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
        /// get device record
        /// </summary>
        /// <param name="deviceId"></param>
        /// <returns></returns>
        public async Task<DeviceState> GetDeviceRecord(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            //deviceId = deviceId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceState>(DeviceDocumentCollectionUri)
                .Where(item => item.id == deviceId)).ConfigureAwait(false);
            return results.FirstOrDefault();
        }

        /// <summary>
        /// get stats records for a period
        /// </summary>
        /// <param name="windowSize">day/hour/minute</param>
        /// <param name="limit">max result count</param>
        /// <returns></returns>
        public async Task<IEnumerable<AggregateStats>> GetLatestAggregateRecords(string windowSize = "day", int? limit = 1000)
        {
            windowSize = windowSize.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<AggregateStats>(AllStatsDocumentCollectionUri)
                .Where(item => item.windowsize == windowSize).OrderByDescending(item => item.windowendtime).Take(limit.Value)).ConfigureAwait(false);
            return results;
        }

        /// <summary>
        /// get stats records for a period for a device
        /// </summary>
        /// <param name="deviceId">device id</param>
        /// <param name="windowSize">day/hour/minute</param>
        /// <param name="limit">max result count</param>
        /// <returns></returns>
        public async Task<IEnumerable<DeviceStats>> GetLatestStatsForDevice(string deviceId, string windowSize = "day", int? limit = 1000)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            //deviceId = deviceId.ToLower();
            windowSize = windowSize.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceStats>(DeviceStatsDocumentCollectionUri)
                .Where(item => item.deviceid == deviceId && item.windowsize == windowSize).OrderByDescending(item => item.time).Take(limit.Value)).ConfigureAwait(false);
            return results;
        }

        /// <summary>
        /// get active alerts for a device
        /// </summary>
        /// <param name="deviceId">device id</param>
        /// <param name="limit">max result count</param>
        /// <returns></returns>
        public async Task<IEnumerable<DeviceAlert>> GetActiveAlertsForDevice(string deviceId, int? limit = 1000)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            //deviceId = deviceId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceAlert>(AlertDocumentCollectionUri)
                .Where(item => item.deviceid == deviceId && item.acknowledged == "false").OrderByDescending(item => item.time).Take(limit.Value)).ConfigureAwait(false);
            return results;
        }

        /// <summary>
        /// get active alerts
        /// </summary>
        /// <param name="limit">max result count</param>
        /// <returns></returns>
        public async Task<IEnumerable<DeviceAlert>> GetActiveAlerts( int? limit = 1000)
        { 
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceAlert>(AlertDocumentCollectionUri)
                .Where(item => item.acknowledged == "false").OrderByDescending(item => item.time).Take(limit.Value)).ConfigureAwait(false);
            return results;
        }

        /// <summary>
        /// Delete All Alerts
        /// </summary>
        /// <returns></returns>
        public async Task DeleteAllAlerts()
        {
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceAlert>(AlertDocumentCollectionUri)).ConfigureAwait(false);
            var tasks = new List<Task<ResourceResponse<Document>>>();
            foreach (var deviceAlert in results)
            {
                tasks.Add(docDbClient.DeleteDocumentAsync(UriFactory.CreateDocumentUri(databaseId, alertDocumentCollectionId,deviceAlert.id)));
            }
            Task.WaitAll(tasks.ToArray());
        }

        /// <summary>
        /// Delete All Alerts For Device
        /// </summary>
        /// <returns></returns>
        public async Task DeleteAllAlertsForDevice(string deviceId)
        {
            if (string.IsNullOrEmpty(deviceId))
            {
                throw new InvalidOperationException("invalid id");
            }

            //deviceId = deviceId.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var results = await QueryAsync(docDbClient.CreateDocumentQuery<DeviceAlert>(AlertDocumentCollectionUri)
                .Where(item => item.deviceid == deviceId)).ConfigureAwait(false);
            var tasks = new List<Task<ResourceResponse<Document>>>();
            foreach (var deviceAlert in results)
            {
                tasks.Add(docDbClient.DeleteDocumentAsync(UriFactory.CreateDocumentUri(databaseId, alertDocumentCollectionId, deviceAlert.id)));
            }
            Task.WaitAll(tasks.ToArray());
        }

        /// <summary>
        /// mark record as acknowledged
        /// </summary>
        /// <param name="id">alert id</param>
        /// <returns></returns>
        public async Task<DeviceAlert> AcknowledgeAlert(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new InvalidOperationException("invalid id");
            }

            //id = id.ToLower();
            var docDbClient = new DocumentClient(new Uri(docDbUri), docDbKey);
            var record = (await QueryAsync(docDbClient.CreateDocumentQuery<DeviceAlert>(AlertDocumentCollectionUri)
                .Where(item => item.id == id)).ConfigureAwait(false)).FirstOrDefault();

            if(null == record)
                throw new InvalidOperationException("record not found");

            //            record.acknowledged = true;
            record.acknowledged = "true";
            record.acknowledgedTime = DateTime.UtcNow;
            var response = await docDbClient.UpsertDocumentAsync(AlertDocumentCollectionUri, record).ConfigureAwait(false);
            return record;
        }
    }
}