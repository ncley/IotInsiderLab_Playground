
    export class Impressions {
        constructor(public impressionId: number, public deviceId: string, public campaignId: string, public messageId: string, public displayedAdId: string, public deviceTimestamp: Date, public insertTimestamp: Date, public facesForImpressions: FacesForImpressions[], public device: Devices, public displayedAd: Ads, public campaign: Campaigns) {
        }
    }
 