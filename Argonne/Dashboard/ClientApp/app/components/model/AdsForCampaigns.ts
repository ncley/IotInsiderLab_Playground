
    export class AdsForCampaigns {
        constructor(public campaignId: string, public adId: string, public sequence: number, public duration: number, public firstImpression: number, public impressionInterval: number, public ad: Ads, public campaign: Campaigns) {
        }
    }
 