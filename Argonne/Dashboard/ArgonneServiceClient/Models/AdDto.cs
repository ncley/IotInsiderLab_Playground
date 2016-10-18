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
    /// Ad ad in the Argonne system
    /// </summary>
    public partial class AdDto
    {
        /// <summary>
        /// Initializes a new instance of the AdDto class.
        /// </summary>
        public AdDto() { }

        /// <summary>
        /// Initializes a new instance of the AdDto class.
        /// </summary>
        public AdDto(string adName, string url, Guid? adId = default(Guid?))
        {
            AdId = adId;
            AdName = adName;
            Url = url;
        }

        /// <summary>
        /// Globally unique identifier assigned by the Argonne system
        /// </summary>
        [JsonProperty(PropertyName = "adId")]
        public Guid? AdId { get; set; }

        /// <summary>
        /// User friendly name for an ad
        /// </summary>
        [JsonProperty(PropertyName = "adName")]
        public string AdName { get; set; }

        /// <summary>
        /// Url for ad media
        /// </summary>
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        /// <summary>
        /// Validate the object. Throws ValidationException if validation fails.
        /// </summary>
        public virtual void Validate()
        {
            if (AdName == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "AdName");
            }
            if (Url == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "Url");
            }
        }
    }
}