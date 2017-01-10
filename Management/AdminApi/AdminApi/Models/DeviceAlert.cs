
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Amqp.Framing;
using Newtonsoft.Json;

namespace AdminApi.Models
{
    public class DeviceAlert
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        public string deviceid { get; set; }
        public string severity { get; set; }
        public bool? acknowledged { get; set; }
        public int? deviceMessagecount { get; set; }
        public double? allDevicesAverage { get; set; }
        public string reason { get; set; }
        public int? windowunit { get; set; }
        public string windowsize { get; set; }

        public DateTime? time { get; set; }
        public DateTime? acknowledgedTime { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}

