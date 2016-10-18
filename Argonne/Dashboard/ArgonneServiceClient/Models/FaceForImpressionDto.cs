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

    public partial class FaceForImpressionDto
    {
        /// <summary>
        /// Initializes a new instance of the FaceForImpressionDto class.
        /// </summary>
        public FaceForImpressionDto() { }

        /// <summary>
        /// Initializes a new instance of the FaceForImpressionDto class.
        /// </summary>
        public FaceForImpressionDto(long? impressionId = default(long?), string faceId = default(string), int? sequence = default(int?), int? age = default(int?), string gender = default(string), double? scoreAnger = default(double?), double? scoreContempt = default(double?), double? scoreDisgust = default(double?), double? scoreFear = default(double?), double? scoreHappiness = default(double?), double? scoreNeutral = default(double?), double? scoreSadness = default(double?), double? scoreSurprise = default(double?))
        {
            ImpressionId = impressionId;
            FaceId = faceId;
            Sequence = sequence;
            Age = age;
            Gender = gender;
            ScoreAnger = scoreAnger;
            ScoreContempt = scoreContempt;
            ScoreDisgust = scoreDisgust;
            ScoreFear = scoreFear;
            ScoreHappiness = scoreHappiness;
            ScoreNeutral = scoreNeutral;
            ScoreSadness = scoreSadness;
            ScoreSurprise = scoreSurprise;
        }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "impressionId")]
        public long? ImpressionId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "faceId")]
        public string FaceId { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "sequence")]
        public int? Sequence { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "age")]
        public int? Age { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "gender")]
        public string Gender { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreAnger")]
        public double? ScoreAnger { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreContempt")]
        public double? ScoreContempt { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreDisgust")]
        public double? ScoreDisgust { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreFear")]
        public double? ScoreFear { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreHappiness")]
        public double? ScoreHappiness { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreNeutral")]
        public double? ScoreNeutral { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreSadness")]
        public double? ScoreSadness { get; set; }

        /// <summary>
        /// </summary>
        [JsonProperty(PropertyName = "scoreSurprise")]
        public double? ScoreSurprise { get; set; }

    }
}