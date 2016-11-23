using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ActivationService.Models;
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;
using RestSharp;

namespace IotHubClient
{
    class Program
    {
        static double lastTemp = 31.35;
        static double increment = 1;

        public static void Main(string[] args)
        {
            var tokenSource = new CancellationTokenSource();
            var token = tokenSource.Token;

            // Store references to the tasks so that we can wait on them and  
            // observe their status after cancellation. 
            Task t;
            var tasks = new ConcurrentBag<Task>();

            Console.WriteLine("Press any key to begin tasks...");
            Console.ReadKey(true);
            Console.WriteLine("To terminate the example, press 'c' to cancel and exit...");
            Console.WriteLine();

            var iotHubConnectionString = DoActivation();

            // Request cancellation of a single task when the token source is canceled. 
            // Pass the token to the user delegate, and also to the task so it can  
            // handle the exception correctly.
            t = Task.Factory.StartNew(() => DoSends(token, iotHubConnectionString), token);
            Console.WriteLine("Sending thread started");
            tasks.Add(t);

            t = Task.Factory.StartNew(() => DoReceives(token, iotHubConnectionString), token);
            Console.WriteLine("Receiving thread started");
            tasks.Add(t);

            while (true)
            {
                // Request cancellation from the UI thread. 
                char ch = Console.ReadKey().KeyChar;
                if (ch == 'c' || ch == 'C')
                {
                    tokenSource.Cancel();
                    Console.WriteLine("\nTask cancellation requested.");
                    break;
                }
                else if (ch == 'u' || ch == 'U')
                {
                    lastTemp += increment;
                }
                else if (ch == 'd' || ch == 'd')
                {
                    lastTemp -= increment;
                }
            }


            try
            {
                Task.WaitAll(tasks.ToArray());
            }
            catch (AggregateException e)
            {
                Console.WriteLine("\nAggregateException thrown with the following inner exceptions:");
                // Display information about each exception. 
                foreach (var v in e.InnerExceptions)
                {
                    if (v is TaskCanceledException)
                        Console.WriteLine("   TaskCanceledException: Task {0}", ((TaskCanceledException)v).Task.Id);
                    else
                        Console.WriteLine("   Exception: {0}", v.GetType().Name);
                }
                Console.WriteLine();
            }
            finally
            {
                tokenSource.Dispose();
            }

        }

        private static string DoActivation()
        {
            //connect to activation service, get back activation record, build iot hub connection string
            var client = new RestClient(ConfigurationManager.AppSettings["ActivationUri"]);
            var code = ConfigurationManager.AppSettings["ActivationKey"];
            var request = new RestRequest("/api/Device/activate/" + code, Method.POST);
            var results = client.Execute<ActivationDto>(request);
            if (null == results || results.Data == null)
            {
                Console.WriteLine("activation failed. hit any key to exit");
                Console.Read();
                throw new InvalidOperationException();
            }
            var activation = results.Data;
            var connection = IotHubConnectionStringBuilder.Create(activation.hostName,
                new DeviceAuthenticationWithRegistrySymmetricKey(activation.deviceId, activation.key));
            return connection.ToString();
        }

        static void DoSends(CancellationToken ct, string iotHubConnectionString)
        {
            // Was cancellation already requested? 
            if (ct.IsCancellationRequested == true)
            {
                Console.WriteLine("DoSends was cancelled before it got started.");
                ct.ThrowIfCancellationRequested();
            }

            long msgTime = 1473956534640;
            var deviceClient = DeviceClient.CreateFromConnectionString(iotHubConnectionString, TransportType.Amqp);

            while (true)
            {
                //send device to cloud telemetry
                var deviceToCloudMessage = new DeviceTelemetryMessage
                {
                    datestamp = DateTime.UtcNow,
                    response = "environment",
                    temperature = lastTemp,
                    humidity = 28.7,
                    pressure = 100912
                };

                var messageString = JsonConvert.SerializeObject(deviceToCloudMessage);
                var sendTask = AzureIoTHub.SendDeviceToCloudMessageAsync(deviceClient, messageString);
                sendTask.Wait(ct);
                Console.WriteLine("Sent Message to Cloud: {0}", messageString);
                ct.WaitHandle.WaitOne(TimeSpan.FromSeconds(5));//wait before sending so we are not in a tight loop

                ++msgTime;
            }
        }

        static void DoReceives(CancellationToken ct, string iotHubConnectionString)
        {
            // Was cancellation already requested? 
            if (ct.IsCancellationRequested == true)
            {
                Console.WriteLine("DoReceives was cancelled before it got started.");
                ct.ThrowIfCancellationRequested();
            }

            var deviceClient = DeviceClient.CreateFromConnectionString(iotHubConnectionString, TransportType.Amqp);
            while (true)
            {
                //receive cloud messages
                var rcvTask = AzureIoTHub.ReceiveCloudToDeviceMessageAsync(deviceClient);
                rcvTask.Wait(ct);
                Console.WriteLine("Received message from cloud: {0}", rcvTask.Result);
              
                if (ct.IsCancellationRequested)
                {
                    Console.WriteLine("Task DoReceives cancelled");
                    ct.ThrowIfCancellationRequested();
                }
            }
        }

    }
}
