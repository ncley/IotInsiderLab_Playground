
    export class Devices {
        constructor(public deviceId: string, public assignedCampaignId: string, public primaryKey: string, public deviceName: string, public address: string, public address2: string, public address3: string, public city: string, public stateProvince: string, public postalCode: string, public activeFrom: Date, public activeTo: Date, public timezone: string, public biasesForDevices: BiasesForDevices, public impressions: Impressions[], public currentCampaign: Campaigns) {
        }
    }
 