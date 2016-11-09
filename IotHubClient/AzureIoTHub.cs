using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Client;

static class AzureIoTHub
{
    //
    // Note: this connection string is specific to the device "nathan-laptop". To configure other devices,
    // see information on iothub-explorer at http://aka.ms/iothubgetstartedVSCS
    //

    const string deviceConnectionString = "You need to fill this in";
    //
    // To monitor messages sent to device "nathan-laptop" use iothub-explorer as follows:
    //    iothub-explorer HostName=IoTLabDemo.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=dUKa8eSJsp+q4hMhI2dS5VmAnd2Ozz2D+e4txCMXc3E= monitor-events "nathan-laptop"
    //

    // Refer to http://aka.ms/azure-iot-hub-vs-cs-wiki for more information on Connected Service for Azure IoT Hub

    public static async Task SendDeviceToCloudMessageAsync(string deviceToCloudMessage)
    {
        var deviceClient = DeviceClient.CreateFromConnectionString(deviceConnectionString, TransportType.Amqp);
        var message = new Message(Encoding.ASCII.GetBytes(deviceToCloudMessage)) {MessageId = Guid.NewGuid().ToString()};
        await deviceClient.SendEventAsync(message);
    }

    public static async Task<string> ReceiveCloudToDeviceMessageAsync()
    {
        var deviceClient = DeviceClient.CreateFromConnectionString(deviceConnectionString, TransportType.Amqp);

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
