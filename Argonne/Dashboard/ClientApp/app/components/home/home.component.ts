import { Component } from '@angular/core';
import Dto = require("../model/CampaignDto");
import AggregateData = require("../model/AdAggregateData");
//import moment = require("moment");

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent {
    // contains the timestamp of when the page was loaded.
    private currentAfterDate: any;

    // stores the specified or default campaign
    public currentCampaign: Dto.CampaignDto;

    // triggers auto pooling of the code
    public enableLiveStream: boolean = true;

//    // $timeout promise to control pooling function
//    public liveStreamTimer: ng.IPromise<any>;

    // contains the webapi campaign ads aggregated data
    public campaignAgData: AggregateData.AdAggregateData;

    // gender chart properties
    public chartAdGenderData: any[][];
    public chartAdGenderOptions: any;
    public chartAdGenderLabels: string[];
    public chartAdGenderSeries: string[];
    public chartAdGenderType: string;
    public chartAdGenderDatasetOverride: any[];

    // impression chart properites
    public chartImpressionSentimentType: string = 'line';
    public chartImpressionSentimentData: any[];
    public chartImpressionSentimentLabels: string[];
    public chartImpressionSentimentSeries: string[];
    public chartImpressionSentimentOption: any;
    public chartImpressionSentitmentDatasetOverride: any[];

    // current campaign id (default or passed in)
    public currentCampaignId: string;

    // Specify the default campaign
    private CAMPAIGN_ID = '3149351f-3c9e-4d0a-bfa5-d8caacfd77f0';

    constructor() {
        //this.currentAfterDate = moment.utc(); // initializes to the current time
        this.currentCampaignId = this.CAMPAIGN_ID;
    }

}
