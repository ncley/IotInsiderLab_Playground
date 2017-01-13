
export class DeviceState {
    constructor(
        public id: string,
        public fiveminutecount: number,
        public fiveminutecounttime:Date,
        public onehourcount: number,
        public onehourcounttime:Date,
        public onedaycount: number,
        public onedaycounttime:Date,
         ) {
    }
}
