
    export class DeviceDto {
        constructor(public deviceId: string, public primaryKey: string, public deviceName: string, public campaignId: string, public address: string, public address2: string, public address3: string, public city: string, public stateProvince: string, public postalCode: string, public activeFrom: Date, public activeTo: Date, public timezone: string) {
        }
    }
 