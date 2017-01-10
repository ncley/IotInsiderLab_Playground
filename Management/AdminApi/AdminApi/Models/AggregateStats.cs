using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Amqp.Framing;
using Newtonsoft.Json;

namespace AdminApi.Models
{
    public class AggregateStats
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        public int? windowunit { get; set; }
        public string windowsize { get; set; }
        public double? avg { get; set; }
        public int? min { get; set; }
        public int? max { get; set; }
        public int? sum { get; set; }
        public DateTime? windowendtime { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
