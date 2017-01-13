
export class DeviceAlert {
    constructor(
        public id: string,
        public deviceid: string,
        public windowunit: number,
        public windowsize: string,
        public severity: string,
        public acknowledged: boolean,
        public reason: string,
        public allDevicesAverage: number,
        public allDevicesMedian: number,
        public deviceMessagecount: number,
        public time:Date,
        public acknowledgedTime:Date,
         ) {
    }
}
