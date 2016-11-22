using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Amqp.Framing;
using Newtonsoft.Json;

namespace AdminApi.Models
{
    public class Activation
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        public string deviceId { get; set; }
        public string hostName { get; set; }
        public string key { get; set; }
        public bool enabled { get; set; }
        public string reason { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}