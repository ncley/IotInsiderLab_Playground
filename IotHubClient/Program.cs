using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace IotHubClient
{
    class Program
    {
        static double lastTemp = 31.35;
        static double increment = 1;
        private static int sendIntervalInSeconds = Convert.ToInt32(ConfigurationManager.AppSettings["sendIntervalInSeconds"]);
        private static string deviceId = ConfigurationManager.AppSettings["deviceId"];

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

            // Request cancellation of a single task when the token source is canceled. 
            // Pass the token to the user delegate, and also to the task so it can  
            // handle the exception correctly.
            t = Task.Factory.StartNew(() => DoSends(token), token);
            Console.WriteLine("Sending thread started");
            tasks.Add(t);

            t = Task.Factory.StartNew(() => DoReceives(token), token);
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

        static void DoSends(CancellationToken ct)
        {
            // Was cancellation already requested? 
            if (ct.IsCancellationRequested == true)
            {
                Console.WriteLine("DoSends was cancelled before it got started.");
                ct.ThrowIfCancellationRequested();
            }

            long msgTime = 1473956534640;
            int iteration = 0;
            while (true)
            {
                //send device to cloud telemetry
                var deviceToCloudMessage = new DeviceTelemetryMessage
                {
                    datestamp = DateTime.UtcNow,
                    response = "environment",
                    temperature = lastTemp,
                    humidity = 28.7,
                    pressure = 100912,
                    message_id = Guid.NewGuid().ToString(),
                    device_id = deviceId
                };

                var messageString = JsonConvert.SerializeObject(deviceToCloudMessage);
                var sendTask = AzureIoTHub.SendDeviceToCloudMessageAsync(messageString, deviceToCloudMessage.message_id);
                sendTask.Wait(ct);
                Console.WriteLine("Sent Message to Cloud: {0}", messageString);
                ct.WaitHandle.WaitOne(TimeSpan.FromSeconds(sendIntervalInSeconds));//wait before sending so we are not in a tight loop

                ++msgTime;
            }
        }

        static void DoReceives(CancellationToken ct)
        {
            // Was cancellation already requested? 
            if (ct.IsCancellationRequested == true)
            {
                Console.WriteLine("DoReceives was cancelled before it got started.");
                ct.ThrowIfCancellationRequested();
            }

            while (true)
            {
                //receive cloud messages
                var rcvTask = AzureIoTHub.ReceiveCloudToDeviceMessageAsync();
                rcvTask.Wait(ct);
                Console.WriteLine("Received message from cloud: {0}", rcvTask.Result);

//                ct.WaitHandle.WaitOne(TimeSpan.FromSeconds(5));

                if (ct.IsCancellationRequested)
                {
                    Console.WriteLine("Task DoReceives cancelled");
                    ct.ThrowIfCancellationRequested();
                }
            }
        }

    }
}
