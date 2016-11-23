using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Client;

public class AzureIoTHub
{
    public static async Task SendDeviceToCloudMessageAsync(DeviceClient deviceClient, string deviceToCloudMessage)
    {
        var message = new Message(Encoding.ASCII.GetBytes(deviceToCloudMessage)) {MessageId = Guid.NewGuid().ToString()};
        await deviceClient.SendEventAsync(message);
    }

    public static async Task<string> ReceiveCloudToDeviceMessageAsync(DeviceClient deviceClient)
    {
        while (true)
        {
            var receivedMessage = await deviceClient.ReceiveAsync();

            if (receivedMessage != null)
            {
                var messageData = Encoding.ASCII.GetString(receivedMessage.GetBytes());
                await deviceClient.CompleteAsync(receivedMessage);
                return messageData;
            }

            await Task.Delay(TimeSpan.FromSeconds(1));
        }
    }
}
