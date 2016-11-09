using System;

namespace IotHubClient
{
    public class DeviceTelemetryMessage
    {
        public DateTime datestamp { get; set; }
        public string response { get; set; }
        public double? pressure { get; set; }
        public double? temperature { get; set; }
        public double? humidity { get; set; }
    }
}
