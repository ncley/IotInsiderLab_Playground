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

    /// <summary>
    /// Represents a moment in time when human(s) impressions of an ad being
    /// displayed were evaluated
    /// </summary>
    public partial class ImpressionDto
    {
        /// <summary>
        /// Initializes a new instance of the ImpressionDto class.
        /// </summary>
        public ImpressionDto() { }

        /// <summary>
        /// Initializes a new instance of the ImpressionDto class.
        /// </summary>
        public ImpressionDto(Guid deviceId, Guid displayedAdId, Guid campaignId, long? impressionId = default(long?), Guid? messageId = default(Guid?), DateTime? deviceTimestamp = default(DateTime?), DateTime? insertTimestamp = default(DateTime?), IList<FaceForImpressionDto> faces = default(IList<FaceForImpressionDto>))
        {
            ImpressionId = impressionId;
            DeviceId = deviceId;
            MessageId = messageId;
            DisplayedAdId = displayedAdId;
            CampaignId = campaignId;
            DeviceTimestamp = deviceTimestamp;
            InsertTimestamp = insertTimestamp;
            Faces = faces;
        }

        /// <summary>
        /// Globally unique identifier assigned by Argonne system
        /// </summary>
        [JsonProperty(PropertyName = "impressionId")]
        public long? ImpressionId { get; set; }

        /// <summary>
        /// The device where the impression occurred
        /// </summary>
        [JsonProperty(PropertyName = "deviceId")]
        public Guid DeviceId { get; set; }

        /// <summary>
        /// Cognitive services message id
        /// </summary>
        [JsonProperty(PropertyName = "messageId")]
        public Guid? MessageId { get; set; }

        /// <summary>
        /// Ad being displayed at time of impression
        /// </summary>
        [JsonProperty(PropertyName = "displayedAdId")]
        public Guid DisplayedAdId { get; set; }

        /// <summary>
        /// Campaign of Ad being displayed at time of impression
        /// </summary>
        [JsonProperty(PropertyName = "campaignId")]
        public Guid CampaignId { get; set; }

        /// <summary>
        /// Timestamp from device at time of impression
        /// </summary>
        [JsonProperty(PropertyName = "deviceTimestamp")]
        public DateTime? DeviceTimestamp { get; set; }

        /// <summary>
        /// Timestamp from Argonne system when impression is recorded
        /// </summary>
        [JsonProperty(PropertyName = "insertTimestamp")]
        public DateTime? InsertTimestamp { get; set; }

        /// <summary>
        /// Faces detected in an impression
        /// </summary>
        [JsonProperty(PropertyName = "faces")]
        public IList<FaceForImpressionDto> Faces { get; set; }

        /// <summary>
        /// Validate the object. Throws ValidationException if validation fails.
        /// </summary>
        public virtual void Validate()
        {
        }
    }
}
