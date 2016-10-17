// Code generated by Microsoft (R) AutoRest Code Generator 0.16.0.0
// Changes may cause incorrect behavior and will be lost if the code is
// regenerated.

namespace ArgonneDashboard.ArgonneServiceClient.Models
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using Microsoft.Rest;
    using Microsoft.Rest.Serialization;

    public partial class Impressions
    {
        /// <summary>
        /// Initializes a new instance of the Impressions class.
        /// </summary>
        public Impressions() { }

        /// <summary>
        /// Initializes a new instance of the Impressions class.
        /// </summary>
        public Impressions(long? impressionId = default(long?), Guid? deviceId = default(Guid?), Guid? campaignId = default(Guid?), Guid? messageId = default(Guid?), Guid? displayedAdId = default(Guid?), DateTime? deviceTimestamp = default(DateTime?), DateTime? insertTimestamp = default(DateTime?), IList<FacesForImpressions> facesForImpressions = default(IList<FacesForImpressions>), Devices device = default(Devices), Ads displayedAd = default(Ads), Campaigns campaign = default(Campaigns))
        {
            ImpressionId = impressionId;
            DeviceId = deviceId;
            CampaignId = campaignId;
            MessageId = messageId;
            DisplayedAdId = displayedAdId;
            DeviceTimestamp = deviceTimestamp;
            InsertTimestamp = insertTimestamp;
            FacesForImpressions = facesForImpressions;
            Device = device;
            DisplayedAd = displayedAd;
            Campaign = campaign;
        }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "impressionId")]
        public long? ImpressionId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "deviceId")]
        public Guid? DeviceId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "campaignId")]
        public Guid? CampaignId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "messageId")]
        public Guid? MessageId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "displayedAdId")]
        public Guid? DisplayedAdId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "deviceTimestamp")]
        public DateTime? DeviceTimestamp { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "insertTimestamp")]
        public DateTime? InsertTimestamp { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "facesForImpressions")]
        public IList<FacesForImpressions> FacesForImpressions { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "device")]
        public Devices Device { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "displayedAd")]
        public Ads DisplayedAd { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "campaign")]
        public Campaigns Campaign { get; set; }

    }
}
