using Newtonsoft.Json;

namespace ActivationService.Models
{
    /// <summary>
    /// Device Activation Record
    /// </summary>
    public class ActivationDto
    {
        public string code { get; set; }
        public string deviceId { get; set; }
        public string hostName { get; set; }
        public string key { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}