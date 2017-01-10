using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Amqp.Framing;
using Newtonsoft.Json;

namespace AdminApi.Models
{
    public class DeviceStats
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        public int? windowunit { get; set; }
        public string windowsize { get; set; }
        public string deviceid { get; set; }
        public int? messagecount { get; set; }
        public DateTime? time { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}

