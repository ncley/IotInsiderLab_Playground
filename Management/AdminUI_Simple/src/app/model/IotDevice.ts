
export class IotDevice {
    constructor(
        public deviceId: string, 
        public generationId: string,
        public connectionState: string,
        public status: string,
        public statusReason: string,
        public lastActivityTime: Date,
        public enabled: boolean
         ) {
    }

    public init = () => {
        this.enabled = this.status == "enabled";
    }
}
 


//   {
//     "deviceId": "string",
//     "generationId": "string",
//     "etag": "string",
//     "connectionState": 0,
//     "status": "enabled",
//     "statusReason": "string",
//     "connectionStateUpdatedTime": "2016-12-08T21:53:23.010Z",
//     "statusUpdatedTime": "2016-12-08T21:53:23.010Z",
//     "lastActivityTime": "2016-12-08T21:53:23.010Z",
//     "cloudToDeviceMessageCount": 0,
//     "authentication": {
//       "symmetricKey": {
//         "primaryKey": "string",
//         "secondaryKey": "string"
//       },
//       "x509Thumbprint": {
//         "primaryThumbprint": "string",
//         "secondaryThumbprint": "string"
//       }
//     }
//   }
