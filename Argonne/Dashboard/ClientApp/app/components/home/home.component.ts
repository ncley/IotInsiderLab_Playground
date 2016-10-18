import { Component } from '@angular/core';
import Dto = require("../model/CampaignDto");
import AggregateData = require("../model/AdAggregateData");
import Service = require("../service/ArgonneService");
import moment = require("moment");

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: [Service.ArgonneService]
})
export class HomeComponent {
    // contains the timestamp of when the page was loaded.
    private currentAfterDate: any;

    public aggregateDataByAd: AggregateData.AdAggregateData[];

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

    constructor(private argonneService: Service.ArgonneService) {
        this.currentAfterDate = moment.utc(); // initializes to the current time
        this.currentCampaignId = this.CAMPAIGN_ID;
        this.getData();
    }

    private sumPropertyOnArray(theArray, propertyName) {
        return theArray.reduce((currentSum, nextItem) => (currentSum + nextItem[propertyName]), 0);
    };

    private getData() {
        // format the timestamp
        //var afterTimestamp = this.currentAfterDate.local().format("YYYY-MM-DDTHH:mm:ss");

        var afterTimestamp = this.currentAfterDate.local().format("2016-10-13T00:00:00");

        // get the web api aggregated data
        this.argonneService.getCampaignAggregate(this.CAMPAIGN_ID, afterTimestamp).subscribe(serviceResponse => {
            this.aggregateDataByAd = serviceResponse;

            // save the campaign aggregated data
            if (this.aggregateDataByAd != null && this.aggregateDataByAd.length > 0) {

                //Sum the ad data at the campaign level
                this.campaignAgData = this.aggregateDataByAd[0];

                this.campaignAgData.ageBracket1 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket1');
                this.campaignAgData.ageBracket2 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket2');
                this.campaignAgData.ageBracket3 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket3');
                this.campaignAgData.ageBracket4 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket4');
                this.campaignAgData.ageBracket5 = this.sumPropertyOnArray(this.aggregateDataByAd, 'ageBracket5');
                this.campaignAgData.females = this.sumPropertyOnArray(this.aggregateDataByAd, 'females');
                this.campaignAgData.males = this.sumPropertyOnArray(this.aggregateDataByAd, 'males');
                this.campaignAgData.totalFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'totalFaces');
                this.campaignAgData.uniqueFaces = this.sumPropertyOnArray(this.aggregateDataByAd, 'uniqueFaces');

                //this.campaignAgData = campaignAdAggregations[0];
                // update the demo chart
                //this.updateChart();
            }
        });
    }

}
