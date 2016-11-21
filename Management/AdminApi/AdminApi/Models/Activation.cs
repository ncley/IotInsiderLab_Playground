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
        public string code { get; set; }
        public bool enabled { get; set; }
        public string HostName { get; set; }
        public string Key { get; set; }


        //"HostName=iotinsiderlab-nathan.azure-devices.net;DeviceId=nathan-laptop;SharedAccessKey=s9uO1xwyjg8CtksnajhATUInKDGyhmFW08pbFI7mPhs=";

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}