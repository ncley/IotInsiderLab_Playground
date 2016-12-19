
export class Activation {
    constructor(
        public id: string, 
        public deviceId: string, 
        public hostName: string,
        public key: string,
        public enabled: string,
        public reason: string,
        public createdDate: Date,
        public activatedDate:Date,
         ) {
    }
}
