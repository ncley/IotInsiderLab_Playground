using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Amqp.Framing;
using Newtonsoft.Json;

namespace AdminApi.Models
{
    public class DeviceState
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        public int? fiveminutecount { get; set; }
        public DateTime? fiveminutecounttime { get; set; }
        public int? onehourcount { get; set; }
        public DateTime? onehourcounttime { get; set; }
        public int? onedaycount { get; set; }
        public DateTime? onedaycounttime { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
